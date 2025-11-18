import type {Canvas} from "./canvas.ts";

export class Brick {
    #canvas: Canvas;
    #position: { x: number; y: number };

    constructor(canvas: Canvas, x: number, y: number) {
        this.#canvas = canvas;
        this.#position = { x, y };
        this.#addToCanvas();
    }

    #addToCanvas(): void {
        this.#canvas.addObject(`brick-${this.#position.x}-${this.#position.y}`, {
            shapeType: "Rectangle",
            x: this.#position.x,
            y: this.#position.y,
            width: 50,
            height: 20
        });
    }
}