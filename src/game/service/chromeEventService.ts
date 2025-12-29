import type {Game} from "../game.ts";
import {GameOverEvent, LevelCompleteEvent, LevelStartEvent} from "../chrome/events.ts";

export class ChromeEventService {
    static emitGameOverEvent(game: Game): void {
        window.dispatchEvent(new GameOverEvent(game.getLevel()))
    }

    static emitLevelCompleteEvent(game: Game): void {
        window.dispatchEvent(new LevelCompleteEvent(game.getLevel()))
    }

    static emitLevelStartEvent(level: number, prizeBalls: number): void {
        window.dispatchEvent(new LevelStartEvent(level, prizeBalls))
    }
}