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

export const levelStartEventName = "LevelStartEvent";
export class LevelStartEvent extends LevelAwareEvent {
    constructor(level: number) {
        super(levelStartEventName, level);
    }
};