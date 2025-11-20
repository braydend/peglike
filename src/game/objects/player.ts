import {getAngleBetweenPoints} from "../../math/trigonometry.ts";
import {MouseControl} from "../../control/mouse.ts";
import {type Canvas, PLAYER_ID} from "./canvas.ts";
import {Missile} from "./missile.ts";
import {Logger} from "../../logger/logger.ts";

export class Player {
    readonly #canvas: Canvas;
    #missile: Missile | undefined;

    constructor(canvas: Canvas) {
        this.#canvas = canvas;
        this.#missile = undefined;
        this.#registerMouseControlListener();
        this.#addPlayerToCanvas();
    }

    #fire(angle: number): void {
        if (this.#missile) {
            Logger.debug(`[Player] missile cannot be fired. Missile #${this.#missile.getId()} is still active`);
            return;
        }
        const onDestroy = (id: string) => {
            this.#canvas.removeObject(id);
            this.#missile = undefined;
            this.#updatePlayer();
            return true;
        }
        const missile = new Missile(
            this.#canvas,
            this.#canvas.getContext().canvas.width / 2,
            this.#canvas.getContext().canvas.height / 2,
            angle,
            10,
            5,
            onDestroy
        );
        this.#missile = missile;
        Logger.debug(`[Player] firing new missile #${missile.getId()}`);
    }

    #registerMouseControlListener() {
        const canvasCenter = {
            x: this.#canvas.getContext().canvas.width / 2,
            y: this.#canvas.getContext().canvas.height / 2
        };
        const onMouseMove = (x: number, y: number) => {
            const angle = getAngleBetweenPoints(x,y, canvasCenter.x, canvasCenter.y);
            this.#updatePlayerWithAngle(angle);
        }

        const onMouseClick = (x: number, y: number) => {
            const angle = getAngleBetweenPoints(x,y, canvasCenter.x, canvasCenter.y);
            this.#fire(angle);
            this.#updatePlayerWithAngle(angle);
        }

        new MouseControl(onMouseMove, onMouseClick);
    }

    #addPlayerToCanvas(): void {
        const canvasCenter = {
            x: this.#canvas.getContext().canvas.width / 2,
            y: this.#canvas.getContext().canvas.height / 2
        }
        this.#canvas.addObject(PLAYER_ID, {
            shapeType: "EquilateralTriangle",
            x: canvasCenter.x,
            y: canvasCenter.y,
            sideLength: 20,
            angle: 0,
            strokeColour: 'green',
        });
    }

    #updatePlayer(): void {
        const playerInstance = this.#canvas.getObject(PLAYER_ID);

        if (!playerInstance || playerInstance.shapeType !== "EquilateralTriangle") {
            return;
        }
        const currentAngle = playerInstance.angle;

        this.#updatePlayerWithAngle(currentAngle);
    }

    #updatePlayerWithAngle(angle: number): void {
        const canvasCenter = {
            x: this.#canvas.getContext().canvas.width / 2,
            y: this.#canvas.getContext().canvas.height / 2
        }
        this.#canvas.updateObject(PLAYER_ID, {
            shapeType: "EquilateralTriangle",
            x: canvasCenter.x,
            y: canvasCenter.y,
            sideLength: 20,
            angle,
            strokeColour: this.#missile ? 'red' : 'green'
        });
    }
}