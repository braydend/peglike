import {ChromeEventService} from "../service/chromeEventService.ts";
import {Logger} from "../../logger/logger.ts";
import {type PrizeItem, PrizeShop} from "../objects/PrizeShop.ts";
import {ElementBuilder} from "./elementBuilder.ts";

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
        ElementBuilder.createDiv(appElement, {id: 'chrome'});
    }

    #getChromeContainer(): HTMLDivElement {
        const chromeContainer = document.getElementById('chrome');
        if (!chromeContainer || !(chromeContainer instanceof HTMLDivElement)){
            throw new Error('Chrome container element not found.');
        }
        return chromeContainer;
    }

    renderStats(): void {

    }

    renderGameOverScreen(highestLevel: number): void{
        Logger.debug('Rendering game over screen');
        const appElement = this.#getAppContainer()
        this.#removeGameCanvas();
        const gameOverElement = ElementBuilder.createDiv(appElement, {id: "gameOverScreen"});
        ElementBuilder.createHeading(gameOverElement, {level: 1, text: "Game Over"});
        const gameOverText = document.createElement('p');
        gameOverText.innerText = `You reached Level ${highestLevel}.`;
        ElementBuilder.createButton(gameOverElement, {
            text: "Restart Game",
            onClick: window.location.reload
        });
        gameOverElement.appendChild(gameOverText);
    }

    renderPrizes(container: HTMLElement): PrizeItem {
        const prizeContainer = ElementBuilder.createDiv(container, {id:'prizeContainer'});
        ElementBuilder.createHeading(prizeContainer, {level:2, text: "Prizes"})
        const prizeShop = new PrizeShop();
        const prizes = prizeShop.getPotentialPrizes();
        prizes.forEach((prize, index) => {
            ElementBuilder.createDiv(prizeContainer, {
                id: `prizeContainer-${index}`,
                text: prize.name,
                attributes: { "data-count": prize.balls.toString(10)}
            });
        });
        const selectedPrize = prizeShop.rollPrize();

        // choose which item must win
        const targetIndex = prizes.findIndex(({balls}) => balls === selectedPrize.balls); // ⭐

// choose how many full spins (randomized)
        const minLoops = 5;
        const maxLoops = 25;
        const loops =
            Math.floor(Math.random() * (maxLoops - minLoops + 1)) + minLoops;

// total steps chosen so final index matches target
        const totalSteps =
            loops * prizes.length + targetIndex;
        const maxSpinDuration = 5000;

        const start = performance.now();

        function easeOutCubic(t: number) {
            return 1 - Math.pow(1 - t, 3);
        }

        function spin(now:number, onComplete: () => void) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / maxSpinDuration, 1);
            const eased = easeOutCubic(progress);

            const step = Math.floor(eased * totalSteps);

            if (step === totalSteps) {
                console.debug("done spinning");
                onComplete();
                return;
            }

            const prizeIndex = step % prizes.length;
            const prizeElement = document.getElementById('prizeContainer-' + prizeIndex);
            if (!prizeElement) {
                console.debug("couldn't find prize element", {id: `prizeContainer-${prizeIndex}`});
                return;
            }
            const previous = document.getElementById('prizeContainer-' + (prizeIndex - 1)) ?? document.getElementById('prizeContainer-' + (prizes.length-1));
            if (!previous) {
                console.debug("couldn't find previous element");
                return;
            }
            console.debug("spin");
            previous.className = "prizeItem";
            prizeElement.className = "prizeItem selected";

            if (progress < 1) {
                requestAnimationFrame((frameTime) => spin(frameTime, onComplete));
                return;
            }
        }

        spin(start, () => {requestAnimationFrame(() => {
            for (let i = 0; i < prizes.length; i++) {
                const prizeElement = document.getElementById('prizeContainer-' + i);
                if (!prizeElement) {
                    console.debug("couldn't find prize element", {id: `prizeContainer-${i}`});
                    continue;
                }
                if (prizeElement.getAttribute("data-count") !== selectedPrize.balls.toString(10)) {
                    prizeElement.className = "prizeItem failed";
                    continue;
                }
                prizeElement.className = "prizeItem success"
            }
            const levelUpButton = [...document.getElementsByTagName('button')].find((element) => element.id === "levelUpButton");
            if (!levelUpButton) {
                console.debug("couldn't find levelUpButton");
                return;
            }
            levelUpButton.disabled = false;
        })});

        return selectedPrize;
    }

    renderLevelUpScreen(completedLevel: number): void{
        Logger.debug(`Completed Level ${completedLevel}`);
        Logger.debug('Rendering Level Up screen');
        const chromeContainer = this.#getChromeContainer()
        const levelUpElement = ElementBuilder.createDiv(chromeContainer, {id: "levelUpScreen"});
        const selectedPrize = this.renderPrizes(levelUpElement);
        ElementBuilder.createHeading(levelUpElement, {
            level: 2,
            text: `Level ${completedLevel} Complete!`
        });
        ElementBuilder.createButton(levelUpElement, {
            id: 'levelUpButton',
            disabled: true,
            text: 'Next level',
            onClick: () => {
                ChromeEventService.emitLevelStartEvent(completedLevel, selectedPrize.balls);
                this.clear();
            }
        });
    }

    clear(): void {
        console.debug("clearing chrome");
        const chromeContainer = this.#getChromeContainer();
        chromeContainer.replaceChildren();
    }
}