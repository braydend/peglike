import {
    type Circle,
    drawCircle,
    drawEquilateralTriangle, drawRectangle,
    type EquilateralTriangle, type Rectangle,
} from "../../canvas/shapes.ts";

type SupportedObjects = EquilateralTriangle | Circle | Rectangle;

export const PLAYER_ID = 'player';

export class Canvas {
    #objects: Map<string, SupportedObjects>;
    #context: CanvasRenderingContext2D;

    constructor(element: HTMLElement) {
        this.#objects = new Map();

        if (!this.#isCanvasElement(element)) {
            throw new Error('Provided element is not a canvas element.');
        }
        const context = element.getContext('2d');

        if (!context) {
            throw new Error('Could not get 2D context from canvas element.');
        }
        this.#context = context;
    }

    beginRenderLoop(): void {
        const renderLoop = () => {
            const collisionObjects = this.#getCollisionObjects();
            for (const key of collisionObjects) {
                this.#objects.delete(key);
            }
            this.#redraw();
            requestAnimationFrame(renderLoop);
        };
        requestAnimationFrame(renderLoop);
    }

    #redraw(): void {
        this.#context.clearRect(0, 0, this.#context.canvas.width, this.#context.canvas.height);
        for (const object of this.#objects.values()) {
            this.#drawShape(object);
        }
    }

    #getCollisionObjects(): Set<string> {
        const missleKeys = Array.from(this.#objects.keys()).filter(key => key.startsWith('missile-'));
        const brickKeys = Array.from(this.#objects.keys()).filter(key => key.startsWith('brick-'));
        const missles = missleKeys.map(key => {
            if (!this.#objects.has(key)) {
                return undefined;
            }
            const object = this.#objects.get(key)!;
            if (object.shapeType !== 'Circle') {
                return undefined;
            }
            return {key, object};
        }).filter((obj) => obj !== undefined);
        const bricks = brickKeys.map(key => {
            if (!this.#objects.has(key)) {
                return undefined;
            }
            const object = this.#objects.get(key)!;
            if (object.shapeType !== 'Rectangle') {
                return undefined;
            }
            return {key, object};
        }).filter((obj) => obj !== undefined);

        return new Set(bricks.map(({key , object: {x,y, width, height}}) => missles.filter(
            ({object:{x: mx, y: my, radius}}) =>
                mx + radius > x &&
                mx - radius < x + width &&
                my + radius > y &&
                my - radius < y + height
        ).length > 0 ? key : undefined).filter((key) => key !== undefined));

    }

    #isCanvasElement(element: HTMLElement): element is HTMLCanvasElement {
        return element.tagName === 'CANVAS';
    }

    getContext(): CanvasRenderingContext2D {
        return this.#context;
    }

    addObject(id: string, object: SupportedObjects): void {
        this.#objects.set(id, object);
    }

    removeObject(id: string): void {
        this.#objects.delete(id);
    }

    getObject(id: string): SupportedObjects | undefined {
        return this.#objects.get(id);
    }

    clear(): void {
        this.#objects.clear();
    }

    updateObject(id: string, object: SupportedObjects): void {
        if (this.#objects.has(id)) {
            this.#objects.set(id, object);
        } else {
            throw new Error(`Object with id ${id} does not exist.`);
        }
    }

    #drawShape(shape: SupportedObjects): void {
        switch (shape.shapeType) {
            case 'EquilateralTriangle':
                drawEquilateralTriangle(this.#context, shape);
                break;
            case 'Circle':
                drawCircle(this.#context, shape);
                break;
            case 'Rectangle':
                drawRectangle(this.#context, shape);
                break;
            default:
                throw new Error(`Unsupported shape type:`);
        }
    }
}