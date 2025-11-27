import type {Position} from "../math/vector.ts";
import type {Game} from "../game/game.ts";
import {Logger} from "../logger/logger.ts";

export class MouseControl {
    #position: Position = { x: 0, y: 0 };
    #gameCanvas: HTMLCanvasElement;
    #clickAbortController: AbortController;

    constructor(game: Game, onMouseMove: (x: number, y: number) => void, onMouseClick: (x: number, y: number) => void) {
        this.#gameCanvas = game.getRenderer().getCanvas();
        this.#clickAbortController = new AbortController();
        this.#registerMouseMoveListener(onMouseMove)
        this.#registerMouseClickListener(onMouseClick)
    }

    cleanup(): void {
        Logger.debug("cleaning up mouse control listeners");
        this.#clickAbortController.abort();
    }

    #registerMouseClickListener(onMouseClick: (x: number, y: number) => void) {
        const mouseControlThis = this;
        this.#gameCanvas.addEventListener('click', function (event: MouseEvent){
            mouseControlThis.#position = mouseControlThis.#calculateTrueMouseLocation(
                this.getBoundingClientRect(),
                { x: event.clientX, y: event.clientY }
            );
            onMouseClick(mouseControlThis.#position.x, mouseControlThis.#position.y);
        }, { signal: this.#clickAbortController.signal });
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