export class Chrome {
    #getAppContainer(): HTMLDivElement {
        const appElement = document.getElementById('app');
        if (!appElement || !(appElement instanceof HTMLDivElement)){
            throw new Error('App container element not found.');
        }
        return appElement;
    }

    #getGameCanvas(): HTMLCanvasElement {
        const canvasElement = document.getElementById('mainCanvas');
        if (!canvasElement || !(canvasElement instanceof HTMLCanvasElement)) {
            throw new Error('Game canvas element not found or is not a canvas.');
        }
        return canvasElement;
    }

    #removeGameCanvas(): void {
        const appElement = this.#getAppContainer();
        const canvasElement = this.#getGameCanvas();
        appElement.removeChild(canvasElement);
    }

    renderGameOverScreen(): void{
        const appElement = this.#getAppContainer()
        this.#removeGameCanvas();
        const gameOverElement = document.createElement('div');
        gameOverElement.id = 'gameOverScreen';
        const gameOverHeading = document.createElement('h1');
        gameOverHeading.innerText = 'Game Over';
        const restartButton = document.createElement('button');
        restartButton.innerText = 'Restart Game';
        restartButton.onclick = () => {
            window.location.reload();
        };
        gameOverElement.appendChild(gameOverHeading);
        gameOverElement.appendChild(restartButton);
        appElement.appendChild(gameOverElement);
    }
}