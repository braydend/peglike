import type {RendererInterface} from "../renderer/rendererInterface.ts";
import {Player} from "./objects/player.ts";
import {Brick} from "./objects/brick.ts";
import {Logger} from "../logger/logger.ts";
import {Chrome} from "./chrome/chrome.ts";

export class Game {
    #renderer: RendererInterface;
    #player: Player;
    #bricks: Map<string, Brick>;

    constructor(renderer: RendererInterface) {
        renderer.setGame(this);
        this.#renderer = renderer;
        this.#player = new Player(this);
        this.#bricks = new Map<string, Brick>();
        this.#generateBricks(15);
        this.#renderer.beginRenderLoop();
    }

    getPlayer(): Player {
        return this.#player;
    }

    setPlayer(player: Player): void {
        this.#player = player;
    }

    getBricks(): Brick[] {
        return Array.from(this.#bricks.values());
    }

    getBrick(id: string): Brick | undefined {
        return this.#bricks.get(id);
    }

    removeBrick(id: string): void {
        Logger.debug("Removing brick with ID:", id);
        this.#bricks.delete(id);
    }

    // TODO: eventually remove and allow rendering via game itself
    getRenderer(): RendererInterface {
        return this.#renderer;
    }

    getCollidedBrickIds(): Set<string> {
        const missile = this.#player.getMissile();
        if (!missile) {
            return new Set();
        }

        const bricks = Array.from(this.#bricks.entries());

        return new Set(
            bricks.filter(([key, brick]) => {
                if (
                    missile.getPosition().x + missile.getRadius() > brick.getPosition().x &&
                    missile.getPosition().x - missile.getRadius() < brick.getPosition().x + brick.getSize().width &&
                    missile.getPosition().y + missile.getRadius() > brick.getPosition().y &&
                    missile.getPosition().y - missile.getRadius() < brick.getPosition().y + brick.getSize().height
                ) return key;
            }
        ).map(([key]) => key));
    }

    gameOver(): void {
        Logger.info("Game Over!");
        new Chrome().renderGameOverScreen();
    }

    #generateBricks(count: number): void {
        const widthCenter = this.#renderer.getCenter().x;
        const heightCenter = this.#renderer.getCenter().y
        const exclusionZone = { minX: widthCenter - 50, maxX: widthCenter + 50, minY: heightCenter - 50, maxY: heightCenter + 50 };

        let positions: { x: number; y: number }[] = [];

        while (positions.length < count) {
            const x = Math.floor(Math.random() * (this.#renderer.getContext().canvas.width - 50));
            const y = Math.floor(Math.random() * (this.#renderer.getContext().canvas.height - 20));

            if (x > exclusionZone.minX && x < exclusionZone.maxX && y > exclusionZone.minY && y < exclusionZone.maxY) {
                continue;
            }

            positions.push({ x, y });
        }

        for (const position of positions) {
            const brick = new Brick(position.x, position.y);
            this.#addBrick(brick);
        }
    }

    #addBrick(brick: Brick): void {
        this.#bricks.set(brick.getId(), brick);
    }
}