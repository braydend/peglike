import type {Canvas} from "./canvas.ts";

export class Missile {
    #id: string;
    #position: { x: number; y: number };
    #velocity: { x: number; y: number };
    #canvas: Canvas;

    constructor(canvas: Canvas, startX: number, startY: number, angle: number, speed: number) {
        this.#id = crypto.randomUUID();
        this.#canvas = canvas;
        this.#position = { x: startX, y: startY };
        this.#velocity = {
            x: -speed * Math.cos(angle),
            y: -speed * Math.sin(angle)
        };
        this.#addMissileToCanvas();
        this.#registerGameLoopListener();
    }

    getId(): string {
        return this.#id;
    }

    #addMissileToCanvas(): void {
        this.#canvas.addObject(`missile-${this.#id}`, {
            shapeType: "Circle",
            x: this.#position.x,
            y: this.#position.y,
            radius: 5
        });
    }

    #registerGameLoopListener(): void {
        const gameLoop = () => {
            this.#updatePosition();
            requestAnimationFrame(gameLoop);
        };
        requestAnimationFrame(gameLoop);
    }

    #updatePosition(): void {
        this.#position.x += this.#velocity.x;
        this.#position.y += this.#velocity.y;

        this.#canvas.updateObject(`missile-${this.#id}`, {
            shapeType: "Circle",
            x: this.#position.x,
            y: this.#position.y,
            radius: 5
        });
    }
}