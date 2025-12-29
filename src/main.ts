import './style.css'
import {CanvasRenderer} from "./renderer/canvas/canvasRenderer.ts";
import {GameService} from "./game/service/gameService.ts";
import {
    GameOverEvent,
    gameOverEventName,
    LevelCompleteEvent,
    levelCompleteEventName,
    LevelStartEvent,
    levelStartEventName
} from "./game/chrome/events.ts";
import {Chrome} from "./game/chrome/chrome.ts";

function init(): {gameService: GameService, chrome: Chrome} {
    const canvasElement = document.getElementById('mainCanvas');

    if (!canvasElement) {
        throw new Error('Could not find the main canvas');
    }
    const mainCanvas = new CanvasRenderer(canvasElement);

    const chrome = new Chrome();

    const gameService = new GameService();
    gameService.newGame(mainCanvas);

    return {
        gameService,
        chrome
    }
}

const params = new URLSearchParams(window.location.search);

if (params.get('debug')) {
    globalThis.debug = true;
}

const {gameService, chrome} = init();

window.addEventListener(gameOverEventName, (event) => {
    if (!(event instanceof GameOverEvent)) return;
    chrome.renderGameOverScreen(event.getLevel());
});

window.addEventListener(levelCompleteEventName, (event) => {
    if (!(event instanceof LevelCompleteEvent)) return;
    chrome.renderLevelUpScreen(event.getLevel());
});

window.addEventListener(levelStartEventName, (event) => {
    if (!(event instanceof LevelStartEvent)) return;
    const currentGame = gameService.getCurrentGame();
    if (!currentGame) {
        throw new Error('Could not find current game');
    }
    currentGame.progressLevel();
})
