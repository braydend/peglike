import type {Canvas} from "./canvas.ts";

export class Brick {
    #id: string
    #canvas: Canvas;
    #position: { x: number; y: number };

    constructor(canvas: Canvas, x: number, y: number) {
        this.#id = `brick-${crypto.randomUUID()}`;
        this.#canvas = canvas;
        this.#position = { x, y };
        this.#addToCanvas();
    }

    #addToCanvas(): void {
        this.#canvas.addObject(this.#id, {
            shapeType: "Rectangle",
            x: this.#position.x,
            y: this.#position.y,
            width: 50,
            height: 20
        });
    }
}