import {getAngleBetweenPoints} from "../../math/trigonometry.ts";
import {MouseControl} from "../../control/mouse.ts";
import {type Canvas, PLAYER_ID} from "./canvas.ts";
import {Missile} from "./missile.ts";

export class Player {
    readonly #canvas: Canvas;

    constructor(canvas: Canvas) {
        this.#canvas = canvas;
        this.#registerMouseControlListener();
        this.#addPlayerToCanvas();
    }

    #fire(angle: number): void {
        new Missile(this.#canvas, this.#canvas.getContext().canvas.width / 2, this.#canvas.getContext().canvas.height / 2, angle, 10);
    }

    #registerMouseControlListener() {
        const canvasCenter = {
            x: this.#canvas.getContext().canvas.width / 2,
            y: this.#canvas.getContext().canvas.height / 2
        };
        const onMouseMove = (x: number, y: number) => {
            const angle = getAngleBetweenPoints(x,y, canvasCenter.x, canvasCenter.y);
            this.#updatePlayer(angle);
        }

        const onMouseClick = (x: number, y: number) => {
            const angle = getAngleBetweenPoints(x,y, canvasCenter.x, canvasCenter.y);
            this.#fire(angle);
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
            angle: 0
        });
    }

    #updatePlayer(angle: number): void {
        const canvasCenter = {
            x: this.#canvas.getContext().canvas.width / 2,
            y: this.#canvas.getContext().canvas.height / 2
        }
        this.#canvas.updateObject(PLAYER_ID, {
            shapeType: "EquilateralTriangle",
            x: canvasCenter.x,
            y: canvasCenter.y,
            sideLength: 20,
            angle
        });
    }
}