import {getAngleBetweenPoints} from "../../math/trigonometry.ts";
import {MouseControl} from "../../control/mouse.ts";
import {Missile} from "./missile.ts";
import {Logger} from "../../logger/logger.ts";
import {Game} from "../game.ts";
import {ChromeEventService} from "../service/chromeEventService.ts";

// ChromeEventService.emitUpdateStatsEvent({ballsLeft: target});

function TriggerStatUpdate(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
) {
    console.debug("---Triggering stat update", {target, propertyKey, descriptor});
    const original = descriptor.set;

    descriptor.set = function (value: number) {
        if(original === undefined) {
            console.debug("undef");
            return;
        }
        console.debug("---Triggering stat update in decorator", {value, original});
        ChromeEventService.emitUpdateStatsEvent({ballsLeft: value});
        original.call(this, value);
    }
}

export class Player {
    readonly #game: Game;
    #missile: Missile | undefined;
    #angle: number;
    #missilesLeft: number = 0;
    #mouseControl: MouseControl;

    constructor(game: Game, missilesLeft = 3) {
        this.#game = game;
        this.#missile = undefined;
        this.#angle = 0;
        this.missilesLeft = missilesLeft;
        this.#mouseControl = this.#registerMouseControlListener();
    }

    @TriggerStatUpdate
    set missilesLeft(value: number) {
        this.#missilesLeft = value;
    }

    getMouseControl(): MouseControl {
        return this.#mouseControl;
    }

    getMissilesLeft(): number {
        return this.#missilesLeft;
    }

    getMissile(): Missile | undefined {
        return this.#missile;
    }

    getAngle(): number {
        return this.#angle;
    }

    canFire(): boolean {
        return this.#missile === undefined;
    }

    removeMissile(): void {
        this.#missile = undefined;
    }

    #fire(angle: number): void {
        if (this.#missile) {
            Logger.debug(`[Player] missile cannot be fired. Missile #${this.#missile.getId()} is still active`);
            return;
        }
        const missile = new Missile(
            this.#game.getRenderer().getCenter(),
            angle,
            10,
            5,
        );
        this.#missile = missile;
        this.missilesLeft = this.#missilesLeft - 1;
        // this.#missilesLeft -= 1;
        Logger.debug(`[Player] firing new missile #${missile.getId()}`);
    }

    #registerMouseControlListener(): MouseControl {
        const canvasCenter = this.#game.getRenderer().getCenter();
        const onMouseMove = (x: number, y: number) => {
            this.#angle = getAngleBetweenPoints(x,y, canvasCenter.x, canvasCenter.y);
        }

        const onMouseClick = (x: number, y: number) => {
            const angle = getAngleBetweenPoints(x,y, canvasCenter.x, canvasCenter.y);
            this.#fire(angle);
            this.#angle = angle;
        }

        return new MouseControl(this.#game, onMouseMove, onMouseClick);
    }
}