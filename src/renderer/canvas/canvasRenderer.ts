import {
    drawCircle,
    drawEquilateralTriangle, drawRectangle,
} from "./shapes.ts";
import type {RendererInterface} from "../rendererInterface.ts";
import type {Game} from "../../game/game.ts";
import type {Brick} from "../../game/objects/brick.ts";
import type {Position} from "../../math/vector.ts";

export class CanvasRenderer implements RendererInterface{
    #context: CanvasRenderingContext2D;
    #game: Game|undefined = undefined;

    constructor(element: HTMLElement) {
        if (!this.#isCanvasElement(element)) {
            throw new Error('Provided element is not a canvas element.');
        }
        const context = element.getContext('2d');

        if (!context) {
            throw new Error('Could not get 2D context from canvas element.');
        }
        this.#context = context;
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

    beginRenderLoop(): void {
        const renderLoop = () => {
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
        this.#renderPlayer();
        this.#renderMissile();
        for (const brick of this.#getGameOrThrow().getBricks()) {
            this.#renderBrick(brick);
        }
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
                text: player.getMissilesLeft().toString()
            }
        );
    }

    #renderBrick(brick: Brick): void {
        drawRectangle(this.#context, {
            position: brick.getPosition(),
            width: brick.getSize().width,
            height: brick.getSize().height,
        });
    }

    #renderMissile(): void {
        const player = this.#getGameOrThrow().getPlayer();
        const missile = player.getMissile();
        if (!missile) {
            return;
        }

        if (this.#isOutsideCanvas(missile.getPosition())) {
            player.removeMissile();
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