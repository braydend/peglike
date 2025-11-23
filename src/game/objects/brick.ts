export class Brick {
    #id: string
    #position: { x: number; y: number };
    #size: { width: number; height: number } = { width: 50, height: 20 };

    constructor(x: number, y: number) {
        this.#id = `brick-${crypto.randomUUID()}`;
        this.#position = { x, y };
    }

    getId(): string {
        return this.#id;
    }

    getPosition(): { x: number; y: number } {
        return this.#position;
    }

    getSize(): { width: number; height: number } {
        return this.#size;
    }
}