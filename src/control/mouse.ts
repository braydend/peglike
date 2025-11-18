export class MouseControl {
    #x: number;
    #y: number;

    constructor(onMouseMove: (x: number, y: number) => void, onMouseClick: (x: number, y: number) => void) {
        this.#x = 0;
        this.#y = 0;

        this.#registerMouseMoveListener(onMouseMove)
        this.#registerMouseClickListener(onMouseClick)
    }

    #registerMouseClickListener(onMouseClick: (x: number, y: number) => void) {
        window.addEventListener('click', (event: MouseEvent) => {
            // Placeholder for future click handling logic
            onMouseClick(event.x, event.y);
        });
    }


    #registerMouseMoveListener(onMouseMove: (x: number, y: number) => void) {
        window.addEventListener('mousemove', (event: MouseEvent) => {
            this.#x = event.clientX;
            this.#y = event.clientY;
            onMouseMove(this.#x, this.#y);
        });
    }
}