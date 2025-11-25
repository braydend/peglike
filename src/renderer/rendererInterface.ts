import type {Game} from "../game/game.ts";

export interface RendererInterface {
    getContext(): CanvasRenderingContext2D;
    beginRenderLoop(onFrame?: () => void): void;
    setGame(game: Game): void;
    getCenter(): { x: number; y: number; };
}