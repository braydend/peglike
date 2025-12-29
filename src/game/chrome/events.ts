class LevelAwareEvent extends Event {
    #level: number;
    constructor(eventName: string, level: number) {
        super(eventName);
        this.#level = level;
    }

    getLevel() {
        return this.#level;
    }
}

export const gameOverEventName = "GameOverEvent";
export class GameOverEvent extends LevelAwareEvent {
    constructor(level: number) {
        super(gameOverEventName, level);
    }
};

export const levelCompleteEventName = "LevelCompleteEvent";
export class LevelCompleteEvent extends LevelAwareEvent {
    constructor(level: number) {
        super(levelCompleteEventName, level);
    }
};


export type Stats = {
    ballsLeft: number;
}
export const statsUpdatedEventName = "StatsUpdatedEvent";
export class StatsUpdatedEvent extends Event {
    #stats: Stats;
    constructor(stats: Stats) {
        super(statsUpdatedEventName);
        this.#stats = stats;
    }

    getStats() {
        return this.#stats;
    }
};

export const levelStartEventName = "LevelStartEvent";
export class LevelStartEvent extends LevelAwareEvent {
    #prizeBalls: number;

    constructor(level: number, prizeBalls: number) {
        super(levelStartEventName, level);
        this.#prizeBalls = prizeBalls;
    }

    getPrizeBalls(): number{
        return this.#prizeBalls;
    }
};