import type {Game} from "../game.ts";
import {GameOverEvent, LevelCompleteEvent, LevelStartEvent, type Stats, StatsUpdatedEvent} from "../chrome/events.ts";
import {Logger} from "../../logger/logger.ts";

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

    static emitUpdateStatsEvent(stats: Stats): void {
        Logger.debug("Emitting stat update event", stats)
        window.dispatchEvent(new StatsUpdatedEvent(stats))
    }
}