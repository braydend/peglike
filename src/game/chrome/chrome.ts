import {ChromeEventService} from "../service/chromeEventService.ts";
import {Logger} from "../../logger/logger.ts";

export class Chrome {
    constructor() {
        this.#addChromeContainer();
    }

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

    #addChromeContainer():void {
        const appElement = this.#getAppContainer();
        const chromeContainer = document.createElement('div');
        chromeContainer.id = 'chrome';

        appElement.appendChild(chromeContainer);

    }

    #getChromeContainer(): HTMLDivElement {
        const chromeContainer = document.getElementById('chrome');
        if (!chromeContainer || !(chromeContainer instanceof HTMLDivElement)){
            throw new Error('Chrome container element not found.');
        }
        return chromeContainer;
    }

    renderGameOverScreen(highestLevel: number): void{
        Logger.debug('Rendering game over screen');
        const appElement = this.#getAppContainer()
        this.#removeGameCanvas();
        const gameOverElement = document.createElement('div');
        gameOverElement.id = 'gameOverScreen';
        const gameOverHeading = document.createElement('h1');
        gameOverHeading.innerText = 'Game Over';
        const gameOverText = document.createElement('p');
        gameOverText.innerText = `You reached Level ${highestLevel}.`;
        const restartButton = document.createElement('button');
        restartButton.innerText = 'Restart Game';
        restartButton.onclick = () => {
            window.location.reload();
        };
        gameOverElement.appendChild(gameOverHeading);
        gameOverElement.appendChild(gameOverText);
        gameOverElement.appendChild(restartButton);
        appElement.appendChild(gameOverElement);
    }

    renderLevelUpScreen(completedLevel: number): void{
        Logger.debug('Rendering Level Up screen');
        const chromeContainer = this.#getChromeContainer()
        const gameOverElement = document.createElement('div');
        gameOverElement.id = 'levelUpScreen';
        const gameOverHeading = document.createElement('h1');
        gameOverHeading.innerText = `Level ${completedLevel} Complete!`;
        const restartButton = document.createElement('button');
        restartButton.innerText = 'Next Level';
        restartButton.onclick = () => {
            ChromeEventService.emitLevelStartEvent(completedLevel);
            this.clear();
        };
        gameOverElement.appendChild(gameOverHeading);
        gameOverElement.appendChild(restartButton);
        chromeContainer.appendChild(gameOverElement);
    }

    clear(): void {
        const chromeContainer = this.#getChromeContainer();
        for (const child of chromeContainer.children) {
            child.remove();
        }
    }
}