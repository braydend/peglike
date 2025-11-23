import type {Circle, EquilateralTriangle, Rectangle} from "./canvas/shapes.ts";

//  TODO: change this to reference objects instaed of shapes
export type RenderableShapes = EquilateralTriangle | Circle | Rectangle;


export interface Renderer {
    addObject(id: string, object: RenderableShapes): void;
    removeObject(id: string): void;
    getObject(id: string): RenderableShapes | undefined;
    updateObject(id: string, object: RenderableShapes): void;
    clearObjects(): void;
    getContext(): unknown;
    setOnRedraw(callback: () => void): void;
}