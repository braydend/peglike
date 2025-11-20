import type {Canvas} from "./canvas.ts";
import type {Rectangle} from "../../renderer/canvas/shapes.ts";
import {Logger} from "../../logger/logger.ts";

interface Position {
    x: number;
    y: number;
}

interface Vector {
    x: number;
    y: number;
}

export class Missile {
    #id: string;
    #position: Position;
    #velocity: Vector;
    #canvas: Canvas;
    #radius: number;
    #onDestroy: (id: string) => boolean;
    #isDestroyed = false;

    constructor(canvas: Canvas, startX: number, startY: number, angle: number, speed: number, radius = 5, onDestroy: (id: string) => boolean) {
        this.#id = `missile-${crypto.randomUUID()}`;
        this.#canvas = canvas;
        this.#position = { x: startX, y: startY };
        this.#velocity = {
            x: -speed * Math.cos(angle),
            y: -speed * Math.sin(angle)
        };
        this.#radius = radius;
        this.#onDestroy = onDestroy;
        this.#addMissileToCanvas();
        this.#registerGameLoopListener();
    }

    getId(): string {
        return this.#id;
    }

    #addMissileToCanvas(): void {
        this.#canvas.addObject(this.#id, {
            shapeType: "Circle",
            x: this.#position.x,
            y: this.#position.y,
            radius: this.#radius,
        });
    }

    #registerGameLoopListener(): void {
        const gameLoop = () => {
            if (this.#isDestroyed) return;
            this.#updatePosition();
            this.#updateBounce();
            requestAnimationFrame(gameLoop);
        };
        requestAnimationFrame(gameLoop);
    }

    #isOutsideCanvas(): boolean {
        const {x,y} = this.#position;
        if (x < 0) return true;
        if (y < 0) return true;
        if (x > this.#canvas.getContext().canvas.width) return true;
        return y > this.#canvas.getContext().canvas.height;
    }

    #updatePosition(): void {
        if (this.#isOutsideCanvas()){
            this.#isDestroyed = this.#onDestroy(this.#id);
            return;
        }
        this.#position.x += this.#velocity.x;
        this.#position.y += this.#velocity.y;

        this.#canvas.updateObject(this.#id, {
            shapeType: "Circle",
            x: this.#position.x,
            y: this.#position.y,
            radius: this.#radius,
        });
    }

    #updateBounce() {
        const {vector, position} = this.#getBounceVector() ?? {vector: this.#velocity, position: this.#position};
        this.#position.x = position.x;
        this.#position.y = position.y;
        this.#velocity.x = vector.x;
        this.#velocity.y = vector.y;
    }

    #getBounceVector(): {vector: Vector, position: Position}|undefined {
        const collidedObjectKeys = this.#canvas.getCollidedObjectKeys();
        for (const objectKey of collidedObjectKeys) {
            Logger.debug(`[Missile #${this.#id}] collided with object #${objectKey}`);

            const collidedObject = this.#canvas.getObject(objectKey);
            if (!collidedObject) continue;
            // TODO: remove the type assertion
            const updatedVectors = this.#resolveCollision(collidedObject as Rectangle);
            this.#canvas.removeObject(objectKey);
            return updatedVectors;
        }
    }

    #resolveCollision(collidedObject: Rectangle): {vector: Vector, position: Position} {
        const overlapLeft = (this.#position.x + this.#radius) - collidedObject.x;
        const overlapRight = (collidedObject.x + collidedObject.width) - (this.#position.x - this.#radius);
        const overlapTop = (this.#position.y + this.#radius) - collidedObject.y;
        const overlapBottom = (collidedObject.y + collidedObject.height) - (this.#position.y - this.#radius);

        const minOverlapX = Math.min(overlapLeft, overlapRight);
        const minOverlapY = Math.min(overlapTop, overlapBottom);

        const isSideHit = minOverlapX < minOverlapY;

        if (isSideHit) {
            const updatedXPosition = overlapLeft < overlapRight
                ? collidedObject.x - this.#radius
                : collidedObject.x +collidedObject.width + this.#radius;

            return {
                vector: {...this.#velocity, x: this.#velocity.x * -1},
                position: {x: updatedXPosition, y: this.#position.y}
            };
        }

        const updatedYPosition = overlapTop < overlapBottom
            ? collidedObject.y - this.#radius
            : collidedObject.y + collidedObject.height + this.#radius;

        return {
            vector: {...this.#velocity, y: this.#velocity.y * -1},
            position: {x: this.#position.x, y: updatedYPosition}
        };
    }
}