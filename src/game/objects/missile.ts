import {Logger} from "../../logger/logger.ts";
import type {Game} from "../game.ts";
import type {Brick} from "./brick.ts";

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
    #game: Game;
    #radius: number;
    #isDestroyed = false;

    constructor( game: Game, startX: number, startY: number, angle: number, speed: number, radius = 5) {
        this.#id = `missile-${crypto.randomUUID()}`;
        this.#game = game;
        this.#position = { x: startX, y: startY };
        this.#velocity = {
            x: -speed * Math.cos(angle),
            y: -speed * Math.sin(angle)
        };
        this.#radius = radius;
        this.#registerGameLoopListener();
    }

    getId(): string {
        return this.#id;
    }

    getPosition(): Position {
        return this.#position;
    }

    getVelocity(): Vector {
        return this.#velocity;
    }

    getRadius(): number {
        return this.#radius;
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

    #updatePosition(): void {
        this.#position.x += this.#velocity.x;
        this.#position.y += this.#velocity.y;
    }

    #updateBounce() {
        const {vector, position} = this.#getBounceVector() ?? {vector: this.#velocity, position: this.#position};
        this.#position.x = position.x;
        this.#position.y = position.y;
        this.#velocity.x = vector.x;
        this.#velocity.y = vector.y;
    }

    #getBounceVector(): {vector: Vector, position: Position}|undefined {
        const collidedBrickIds = this.#game.getCollidedBrickIds();
        for (const collidedBrickId of collidedBrickIds) {
            Logger.debug(`[Missile #${this.#id}] collided with object #${collidedBrickId}`);

            const collidedBrick = this.#game.getBrick(collidedBrickId);
            if (!collidedBrick) continue;
            const updatedVectors = this.#resolveCollision(collidedBrick);
            this.#game.removeBrick(collidedBrickId);
            return updatedVectors;
        }
    }

    #resolveCollision(collidedBrick: Brick): {vector: Vector, position: Position} {
        const overlapLeft = (this.#position.x + this.#radius) - collidedBrick.getPosition().x;
        const overlapRight = (collidedBrick.getPosition().x + collidedBrick.getSize().width) - (this.#position.x - this.#radius);
        const overlapTop = (this.#position.y + this.#radius) - collidedBrick.getPosition().y;
        const overlapBottom = (collidedBrick.getPosition().y + collidedBrick.getSize().height) - (this.#position.y - this.#radius);

        const minOverlapX = Math.min(overlapLeft, overlapRight);
        const minOverlapY = Math.min(overlapTop, overlapBottom);

        const isSideHit = minOverlapX < minOverlapY;

        if (isSideHit) {
            const updatedXPosition = overlapLeft < overlapRight
                ? collidedBrick.getPosition().x - this.#radius
                : collidedBrick.getPosition().x +collidedBrick.getSize().width + this.#radius;

            return {
                vector: {...this.#velocity, x: this.#velocity.x * -1},
                position: {x: updatedXPosition, y: this.#position.y}
            };
        }

        const updatedYPosition = overlapTop < overlapBottom
            ? collidedBrick.getPosition().y - this.#radius
            : collidedBrick.getPosition().y + collidedBrick.getSize().height + this.#radius;

        return {
            vector: {...this.#velocity, y: this.#velocity.y * -1},
            position: {x: this.#position.x, y: updatedYPosition}
        };
    }
}