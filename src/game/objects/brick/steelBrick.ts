import {BaseBrick} from "./baseBrick.ts";

/**
 * A steel brick must be hit continually until hitsRemaining is reduced below zero
 */
export class SteelBrick extends BaseBrick {
    #id: string
    #hitsRemaining: number

    constructor(x: number, y: number, hitsRemaining = 3) {
        super(x, y);
        this.#id = `steel-brick-${crypto.randomUUID()}`;
        this.#hitsRemaining = hitsRemaining;
    }

    getId(): string {
        return this.#id;
    }

    getHitsRemaining() {
        return this.#hitsRemaining;
    }

    onHit() {
        this.#hitsRemaining -= 1;
    }
}