import './style.css'
import {Player} from "./game/objects/player.ts";
import {CanvasRenderer} from "./renderer/canvas/canvasRenderer.ts";
import {Brick} from "./game/objects/brick.ts";

type InitialisedPage = {
    mainCanvas: CanvasRenderer;
}

function init(): InitialisedPage {
    const canvasElement = document.getElementById('mainCanvas');

    if (!canvasElement) {
        throw new Error('Could not find the main canvas');
    }

    const mainCanvas = new CanvasRenderer(canvasElement);

    return  {
        mainCanvas
    }
}

const page = init();

const player = new Player(page.mainCanvas);

const widthCenter = page.mainCanvas.getContext().canvas.width/2
const heightCenter = page.mainCanvas.getContext().canvas.height/2
const exclusionZone = {minX: widthCenter - 15, maxX: widthCenter + 15, minY: heightCenter - 15, maxY: heightCenter + 15};

let positions: {x: number, y: number}[] = [];

while (positions.length < 15) {
    const x = Math.floor(Math.random() * (page.mainCanvas.getContext().canvas.width - 50));
    const y = Math.floor(Math.random() * (page.mainCanvas.getContext().canvas.height - 20));

    if (x > exclusionZone.minX && x < exclusionZone.maxX && y > exclusionZone.minY && y < exclusionZone.maxY) {
        continue;
    }

    positions.push({x, y});
}

for (const position of positions) {
    new Brick(page.mainCanvas, position.x, position.y);
}

page.mainCanvas.beginRenderLoop();