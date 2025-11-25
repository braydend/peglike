import {BaseBrick} from "./baseBrick.ts";

export class BasicBrick extends BaseBrick {
    #id: string

    constructor(x: number, y: number) {
        super(x, y);
        this.#id = `basic-brick-${crypto.randomUUID()}`;
    }

    getId(): string {
        return this.#id;
    }
}