import {BaseBrick} from "./baseBrick.ts";

/**
 * A glass brick can be hit and destroyed without changing the trajectory of a missile
 */
export class GlassBrick extends BaseBrick {
    #id: string

    constructor(x: number, y: number) {
        super(x, y);
        this.#id = `glass-brick-${crypto.randomUUID()}`;
    }

    getId(): string {
        return this.#id;
    }
}