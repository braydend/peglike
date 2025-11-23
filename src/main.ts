import './style.css'
import {CanvasRenderer} from "./renderer/canvas/canvasRenderer.ts";
import {Game} from "./game/game.ts";

function init(): Game {
    const canvasElement = document.getElementById('mainCanvas');

    if (!canvasElement) {
        throw new Error('Could not find the main canvas');
    }

    const mainCanvas = new CanvasRenderer(canvasElement);

    return new Game(mainCanvas);
}

init();
