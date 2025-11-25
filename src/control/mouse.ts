import type {Position} from "../math/vector.ts";

export class MouseControl {
    #position: Position = { x: 0, y: 0 };
    #gameCanvas: HTMLCanvasElement;

    constructor(onMouseMove: (x: number, y: number) => void, onMouseClick: (x: number, y: number) => void) {
        const canvas = document.getElementById('mainCanvas')
        if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
            throw new Error('Unable to find canvas');
        }
        this.#gameCanvas = canvas;
        this.#registerMouseMoveListener(onMouseMove)
        this.#registerMouseClickListener(onMouseClick)
    }

    #registerMouseClickListener(onMouseClick: (x: number, y: number) => void) {
        const mouseControlThis = this;
        this.#gameCanvas.addEventListener('click', function (event: MouseEvent){
            mouseControlThis.#position = mouseControlThis.#calculateTrueMouseLocation(
                this.getBoundingClientRect(),
                { x: event.clientX, y: event.clientY }
            );
            onMouseClick(mouseControlThis.#position.x, mouseControlThis.#position.y);
        });
    }


    #registerMouseMoveListener(onMouseMove: (x: number, y: number) => void) {
        const mouseControlThis = this;
        this.#gameCanvas.addEventListener('mousemove', function (event: MouseEvent) {
            mouseControlThis.#position = mouseControlThis.#calculateTrueMouseLocation(
                this.getBoundingClientRect(),
                { x: event.clientX, y: event.clientY }
            );
            onMouseMove(mouseControlThis.#position.x, mouseControlThis.#position.y);
        });
    }

    #calculateTrueMouseLocation(boundingClient: DOMRect, mousePosition: Position): Position {
        return {
            x: mousePosition.x - (boundingClient.left),
            y: mousePosition.y - (boundingClient.top),
        }
    }
}