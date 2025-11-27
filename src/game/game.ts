import {Player} from "./objects/player.ts";
import {Logger} from "../logger/logger.ts";
import {Chrome} from "./chrome/chrome.ts";
import type {BaseBrick} from "./objects/brick/baseBrick.ts";
import {BasicBrick} from "./objects/brick/basicBrick.ts";
import {GlassBrick} from "./objects/brick/glassBrick.ts";
import {SteelBrick} from "./objects/brick/steelBrick.ts";
import {CollisionDetectionService} from "./service/collisionDetectionService.ts";
import type {Missile} from "./objects/missile.ts";

export class Game {
    #renderer: CanvasRenderer;
    #player: Player;
    #bricks: Map<string, BaseBrick>;
    // TODO: increment this when player clears a level
    #level = 2;

    constructor(renderer: CanvasRenderer, level: number) {
        renderer.setGame(this);
        this.#renderer = renderer;
        this.#player = new Player(this);
        this.#bricks = new Map<string, BaseBrick>();
        this.#generateBricks();
        const collisionDetectionService = new CollisionDetectionService(this);
        const onFrame = () => {
            const missile = this.#player.getMissile();
            if (!missile) return;
            collisionDetectionService.resolveCollision(missile);
            this.#updateMissile(missile);
        }
        this.#renderer.beginRenderLoop(onFrame);
    }

    getPlayer(): Player {
        return this.#player;
    }

    setPlayer(player: Player): void {
        this.#player = player;
    }

    getBricks(): BaseBrick[] {
        return Array.from(this.#bricks.values());
    }

    getBrick(id: string): BaseBrick | undefined {
        return this.#bricks.get(id);
    }

    removeBrick(id: string): void {
        Logger.debug("Removing brick with ID:", id);
        this.#bricks.delete(id);
    }

    getRenderer(): CanvasRenderer {
        return this.#renderer;
    }

    getCollidedBrickId(): string | undefined {
        const missile = this.#player.getMissile();
        if (!missile) {
            return;
        }

        const bricks = Array.from(this.#bricks.entries());

        return bricks.filter(([key, brick]) => {
                if (
                    missile.getPosition().x + missile.getRadius() > brick.getPosition().x &&
                    missile.getPosition().x - missile.getRadius() < brick.getPosition().x + brick.getSize().width &&
                    missile.getPosition().y + missile.getRadius() > brick.getPosition().y &&
                    missile.getPosition().y - missile.getRadius() < brick.getPosition().y + brick.getSize().height
                ) return key;
            }
        ).map(([key]) => key).at(0);
    }

    gameOver(): void {
        Logger.info("Game Over!");
        new Chrome().renderGameOverScreen();
    }

    #updateMissile(missile: Missile): void {
        missile.updatePosition();
    }

    #generateBricks(): void {
        const widthCenter = this.#renderer.getCenter().x;
        const heightCenter = this.#renderer.getCenter().y
        const exclusionZone = { minX: widthCenter - 50, maxX: widthCenter + 50, minY: heightCenter - 50, maxY: heightCenter + 50 };
        const bricksToGenerate = this.#getBricksForLevel();

        let positions: { x: number; y: number }[] = [];

        while (positions.length < bricksToGenerate.length) {
            const x = Math.floor(Math.random() * (this.#renderer.getContext().canvas.width - 50));
            const y = Math.floor(Math.random() * (this.#renderer.getContext().canvas.height - 20));

            if (x > exclusionZone.minX && x < exclusionZone.maxX && y > exclusionZone.minY && y < exclusionZone.maxY) {
                continue;
            }

            positions.push({ x, y });
        }

        for (let i = 0; i < bricksToGenerate.length; i++) {
            const position = positions[i];
            switch (bricksToGenerate[i]) {
                case 'basic':
                    this.#addBrick(new BasicBrick(position.x, position.y));
                    break;
                case "glass":
                    this.#addBrick(new GlassBrick(position.x, position.y));
                    break;
                case "steel":
                    this.#addBrick(new SteelBrick(position.x, position.y));
                    break;
            }
        }
    }

    #getBricksForLevel(): ('basic'|'glass'|'steel')[] {
        if (this.#level === 1) {
            return new Array(10).fill('basic');
        }

        return new Array(11)
            .fill('basic', 0, 6)
            .fill('glass', 6,9)
            .fill('steel',9,10);
    }

    #addBrick(brick: BaseBrick): void {
        this.#bricks.set(brick.getId(), brick);
    }
}