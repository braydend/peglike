import type {Game} from "../game.ts";
import type {Position, Velocity} from "../../math/vector.ts";
import {Logger} from "../../logger/logger.ts";
import {GlassBrick} from "../objects/brick/glassBrick.ts";
import {SteelBrick} from "../objects/brick/steelBrick.ts";
import type {BaseBrick} from "../objects/brick/baseBrick.ts";
import type {Missile} from "../objects/missile.ts";
import {BasicBrick} from "../objects/brick/basicBrick.ts";

export class CollisionDetectionService {
    #game: Game;

    constructor(game: Game) {
        this.#game = game;
    }

    resolveCollision(missile: Missile): void {
        const collidedBrickId = this.#game.getCollidedBrickId();

        if (collidedBrickId === undefined) return;

        Logger.debug(`[Missile #${missile.getId()}] collided with object #${collidedBrickId}`);
        const collidedBrick = this.#game.getBrick(collidedBrickId);
        if (!collidedBrick) return;

        if (collidedBrick instanceof GlassBrick) {
            this.#game.removeBrick(collidedBrickId);
            return;
        }

        const updatedVectors = this.#calculateBounceVector(missile, collidedBrick);

        if (collidedBrick instanceof SteelBrick) {
            collidedBrick.onHit();
            const isDestroyed = collidedBrick.getHitsRemaining() < 0;
            if (isDestroyed) {
                this.#game.removeBrick(collidedBrickId);
            }
        }

        if (collidedBrick instanceof BasicBrick) {
            this.#game.removeBrick(collidedBrickId);
        }

        missile.setVelocity(updatedVectors.vector);
        missile.setPosition(updatedVectors.position);
    }

    // TODO: there's a bug where when hitting the corner of bricks
    #calculateBounceVector(missile: Missile, collidedBrick: BaseBrick): {vector: Velocity, position: Position} {
        const overlapLeft = (missile.getPosition().x + missile.getRadius()) - collidedBrick.getPosition().x;
        const overlapRight = (collidedBrick.getPosition().x + collidedBrick.getSize().width) - (missile.getPosition().x - missile.getRadius());
        const overlapTop = (missile.getPosition().y + missile.getRadius()) - collidedBrick.getPosition().y;
        const overlapBottom = (collidedBrick.getPosition().y + collidedBrick.getSize().height) - (missile.getPosition().y - missile.getRadius());

        const minOverlapX = Math.min(overlapLeft, overlapRight);
        const minOverlapY = Math.min(overlapTop, overlapBottom);

        const isSideHit = minOverlapX < minOverlapY;

        if (isSideHit) {
            const updatedXPosition = overlapLeft < overlapRight
                ? collidedBrick.getPosition().x - missile.getRadius()
                : collidedBrick.getPosition().x +collidedBrick.getSize().width + missile.getRadius();

            return {
                vector: {...missile.getVelocity(), x: missile.getVelocity().x * -1},
                position: {x: updatedXPosition, y: missile.getPosition().y}
            };
        }

        const updatedYPosition = overlapTop < overlapBottom
            ? collidedBrick.getPosition().y - missile.getRadius()
            : collidedBrick.getPosition().y + collidedBrick.getSize().height + missile.getRadius();

        return {
            vector: {...missile.getVelocity(), y: missile.getVelocity().y * -1},
            position: {x: missile.getPosition().x, y: updatedYPosition}
        };
    }
}