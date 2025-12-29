import {Game} from "../game.ts";
import type {CanvasRenderer} from "../../renderer/canvas/canvasRenderer.ts";
import {Logger} from "../../logger/logger.ts";

export class GameService {
    #currentGame: Game |undefined;
    newGame(renderer: CanvasRenderer): Game {
        Logger.debug("Starting new game");
        const newGame = new Game(renderer, 1);
        this.#currentGame = newGame;
        return newGame;
    }

    getCurrentGame(): Game|undefined {
        return this.#currentGame;
    }

    progressLevel(game: Game): Game {
        const newLevel = game.getLevel() + 1;
        Logger.debug(`progressing to level ${newLevel}`);

        if (!this.#currentGame) {
            throw Error(`Cannot progress to level ${newLevel}, current game is missing`);
        }
        this.#currentGame.progressLevel();

        return this.#currentGame;
    }
}