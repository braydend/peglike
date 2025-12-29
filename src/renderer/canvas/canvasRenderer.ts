import {
    drawCircle,
    drawEquilateralTriangle, drawRectangle,
} from "./shapes.ts";
import type {Game} from "../../game/game.ts";
import type {Position} from "../../math/vector.ts";
import type {BaseBrick} from "../../game/objects/brick/baseBrick.ts";
import {GlassBrick} from "../../game/objects/brick/glassBrick.ts";
import {BasicBrick} from "../../game/objects/brick/basicBrick.ts";
import {SteelBrick} from "../../game/objects/brick/steelBrick.ts";
import {ChromeEventService} from "../../game/service/chromeEventService.ts";
import {Logger} from "../../logger/logger.ts";

export class CanvasRenderer{
    #context: CanvasRenderingContext2D;
    #canvas: HTMLCanvasElement;
    #game: Game|undefined = undefined;

    constructor(element: HTMLElement) {
        if (!this.#isCanvasElement(element)) {
            throw new Error('Provided element is not a canvas element.');
        }
        this.#canvas = element;
        const context = element.getContext('2d');

        if (!context) {
            throw new Error('Could not get 2D context from canvas element.');
        }
        this.#context = context;
    }

    getCanvas(): HTMLCanvasElement {
        return this.#canvas;
    }

    getCenter(): { x: number; y: number } {
        return {
            x: this.#context.canvas.width / 2,
            y: this.#context.canvas.height / 2
        };
    }

    setGame(game: Game): void {
        this.#game = game;
    }

    getContext() {
        return this.#context;
    }

    beginRenderLoop(onFrame?: () => void): void {
        const renderLoop = () => {
            onFrame?.();
            this.#redraw();
            requestAnimationFrame(renderLoop);
        };
        requestAnimationFrame(renderLoop);
    }

    #getGameOrThrow(): Game {
        if (!this.#game) {
            throw new Error('Game instance is not set in renderer.');
        }
        return this.#game;
    }

    #clearCanvas(): void {
        this.#context.clearRect(0, 0, this.#context.canvas.width, this.#context.canvas.height);
    }

    #redraw(): void {
        this.#clearCanvas();
        if (globalThis.debug) {
            this.#debug();
        }
        this.#renderPlayer();
        this.#renderMissile();
        for (const brick of this.#getGameOrThrow().getBricks()) {
            this.#renderBrick(brick);
        }
    }

    #debug(): void {
        this.#renderCenterPoint();
        const ctx = this.#context;
        const centerPoint = this.getCenter();
        const playerAngle = this.#getGameOrThrow().getPlayer().getAngle();
        // draw line from center in the same direction the missile will travel
        // missile velocity uses -cos/-sin of the angle, so mirror the debug line accordingly
        const length = Math.max(ctx.canvas.width, ctx.canvas.height);
        const targetX = centerPoint.x - length * Math.cos(playerAngle);
        const targetY = centerPoint.y - length * Math.sin(playerAngle);
        ctx.beginPath();
        ctx.moveTo(centerPoint.x, centerPoint.y);
        ctx.lineTo(targetX, targetY);
        ctx.stroke();
    }

    #renderCenterPoint(): void {
        const ctx = this.#context;
        const centerPoint = this.getCenter();
        const pathBounds = [{x: 10}, {x:-10}, {y: 10}, {y:-10}];
        ctx.beginPath();
        for (const pathBound of pathBounds) {
            ctx.moveTo(centerPoint.x, centerPoint.y);
            const targetY = pathBound.y ? centerPoint.y + pathBound.y : centerPoint.y;
            const targetX = pathBound.x ? centerPoint.x + pathBound.x : centerPoint.x;
            ctx.lineTo(targetX, targetY);
        }
        ctx.closePath();
        ctx.stroke();
    }

    #renderPlayer(): void {
        const player = this.#getGameOrThrow().getPlayer();
        const canvasCenter: Position = {
            x: this.#context.canvas.width / 2,
            y: this.#context.canvas.height / 2
        }

        drawEquilateralTriangle(this.#context, {
            position: canvasCenter,
            sideLength: 20,
            angle: player.getAngle()},
            {
                strokeColour: player.canFire() ? 'green' : 'red',
            }
        );
    }

    #renderBrick(brick: BaseBrick): void {
        if (brick instanceof BasicBrick) {
            this.#renderBasicBrick(brick);
            return;
        }

        if (brick instanceof GlassBrick) {
            this.#renderGlassBrick(brick);
            return;
        }

        if (brick instanceof SteelBrick) {
            this.#renderSteelBrick(brick);
            return;
        }

        throw Error(`Unable to render brick: ${brick.getId()}`)
    }

    #renderBasicBrick(brick: BasicBrick): void {
        drawRectangle(this.#context, {
            position: brick.getPosition(),
            width: brick.getSize().width,
            height: brick.getSize().height,
        });
    }

    #renderGlassBrick(brick: GlassBrick): void {
        drawRectangle(this.#context, {
            position: brick.getPosition(),
            width: brick.getSize().width,
            height: brick.getSize().height,
        }, {
            strokeColour: 'lightBlue',
        });
    }

    #renderSteelBrick(brick: SteelBrick): void {
        drawRectangle(this.#context, {
            position: brick.getPosition(),
            width: brick.getSize().width,
            height: brick.getSize().height,
        }, {
            strokeColour: 'lightGray',
            fillColour: this.#getSteelBrickFillColour(brick),
        });
    }

    #getSteelBrickFillColour(brick: SteelBrick): string {
        switch (brick.getHitsRemaining()){
            case 3:
                return 'gray'
            case 2:
                return 'lightslategray'
            case 1:
                return 'darkgray'
            default:
                return 'lightgray'
        }
    }

    #renderMissile(): void {
        const game = this.#getGameOrThrow();
        const player = game.getPlayer();
        const missile = player.getMissile();
        if (!missile) {
            return;
        }

        if (this.#isOutsideCanvas(missile.getPosition())) {
            player.removeMissile();
            if (game.isFailed()) {
                Logger.debug("Game over");
                game.getPlayer().getMouseControl().cleanup();
                game.gameOver();
            }

            if (game.isComplete()) {
                Logger.debug("Game complete");
                game.getPlayer().getMouseControl().cleanup();
                ChromeEventService.emitLevelCompleteEvent(game);
            }
        }

        drawCircle(this.#context, {
            position: missile.getPosition(),
            radius: missile.getRadius(),
        });
    }

    #isCanvasElement(element: HTMLElement): element is HTMLCanvasElement {
        return element.tagName === 'CANVAS';
    }

    #isOutsideCanvas({x,y}: Position): boolean {
        if (x < 0) return true;
        if (y < 0) return true;
        if (x > this.getContext().canvas.width) return true;
        return y > this.getContext().canvas.height;
    }
}