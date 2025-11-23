import type {CanvasRenderer} from "../../renderer/canvas/canvasRenderer.ts";

export class Brick {
    #id: string
    #canvas: CanvasRenderer;
    #position: { x: number; y: number };

    constructor(canvas: CanvasRenderer, x: number, y: number) {
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