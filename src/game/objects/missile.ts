import type {Position, Velocity} from "../../math/vector.ts";

export class Missile {
    #id: string;
    #position: Position;
    #velocity: Velocity;
    #radius: number;

    constructor(startPosition: Position, angle: number, speed: number, radius = 5) {
        this.#id = `missile-${crypto.randomUUID()}`;
        this.#position = startPosition;
        this.#velocity = {
            x: -speed * Math.cos(angle),
            y: -speed * Math.sin(angle)
        };
        this.#radius = radius;
    }

    getId(): string {
        return this.#id;
    }

    getPosition(): Position {
        return this.#position;
    }

    setPosition(position: Position): void {
        this.#position = position;
    }

    getVelocity(): Velocity {
        return this.#velocity;
    }

    setVelocity(velocity: Velocity): void {
        this.#velocity = velocity;
    }

    getRadius(): number {
        return this.#radius;
    }


    updatePosition(): void {
        this.#position = {
            x: this.#position.x + this.#velocity.x,
            y: this.#position.y + this.#velocity.y
        };
    }
}