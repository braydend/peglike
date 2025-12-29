import {ChromeEventService} from "../service/chromeEventService.ts";
import {Logger} from "../../logger/logger.ts";
import {PrizeShop} from "../objects/PrizeShop.ts";

export class Chrome {
    constructor() {
        this.#addChromeContainer();
    }

    #getAppContainer(): HTMLElement {
        const appElement = document.getElementById('app');
        if (!appElement || !(appElement instanceof HTMLElement)){
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
        Logger.debug(`Completed Level ${completedLevel}`);
        Logger.debug('Rendering Level Up screen');
        const chromeContainer = this.#getChromeContainer()
        const levelUpElement = document.createElement('div');
        levelUpElement.id = 'levelUpScreen';
        const levelUpHeading = document.createElement('h1');
        levelUpHeading.innerText = `Level ${completedLevel} Complete!`;
        const prizeHeading = document.createElement('h2');
        prizeHeading.innerText = 'Prizes';
        const prizeContainer = document.createElement('div');
        const prizeShop = new PrizeShop();
        const prizes = prizeShop.getPotentialPrizes();
        prizes.forEach((prize, index) => {
            const prizeElement = document.createElement('div');
            prizeElement.id = `prizeContainer-${index}`;
            prizeElement.setAttribute("data-count", prize.balls.toString(10));
            prizeElement.innerText = prize.name
            prizeContainer.appendChild(prizeElement);
        });
        chromeContainer.appendChild(prizeContainer);
        const selectedPrize = prizeShop.rollPrize();
        for (let i = 0; i < prizes.length; i++) {
            const prizeElement = document.getElementById('prizeContainer-' + i);
            if (!prizeElement) {
                console.debug("couldn't find prize element", {id: `prizeContainer-${i}`});
                continue;
            };
            if (prizeElement.getAttribute("data-count") !== selectedPrize.balls.toString(10)) {
                prizeElement.className = "failed";
                continue;
            }
            prizeElement.className = "success"
        }
        const levelUpButton = document.createElement('button');
        levelUpButton.innerText = 'Next Level';
        levelUpButton.onclick = () => {
            ChromeEventService.emitLevelStartEvent(completedLevel, selectedPrize.balls);
            this.clear();
        };
        levelUpElement.appendChild(levelUpHeading);
        levelUpElement.appendChild(levelUpButton);
        chromeContainer.appendChild(levelUpElement);
    }

    clear(): void {
        console.debug("clearing chrome");
        const chromeContainer = this.#getChromeContainer();
        chromeContainer.replaceChildren();
    }
}