import type {Position} from "../../math/vector.ts";

export interface Shape {
    shapeType: string;
    x: number;
    y: number;
}

type ExtraRenderOptions = {
    text?: string;
    strokeColour?: string;
    fillColour?: string;
}

const resetColours = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black';
}

export type EquilateralTriangle = {
    shapeType: 'EquilateralTriangle';
    position: Position;
    sideLength: number;
    angle: number;
}

export function drawEquilateralTriangle(
    ctx: CanvasRenderingContext2D,
    {position:{x,y},angle,sideLength}: Omit<EquilateralTriangle, "shapeType">,
    extraOptions?: ExtraRenderOptions
) {
    const calculatedAngle = angle - Math.PI / 3;
    ctx.beginPath();
    ctx.moveTo(
        x + sideLength * Math.cos(calculatedAngle),
        y + sideLength * Math.sin(calculatedAngle)
    );
    ctx.lineTo(
        x + sideLength * Math.cos(calculatedAngle + (2 * Math.PI) / 3),
        y + sideLength * Math.sin(calculatedAngle + (2 * Math.PI) / 3)
    );
    ctx.lineTo(
        x + sideLength * Math.cos(calculatedAngle + (4 * Math.PI) / 3),
        y + sideLength * Math.sin(calculatedAngle + (4 * Math.PI) / 3)
    );
    ctx.strokeStyle = extraOptions?.strokeColour ?? 'black';
    if (extraOptions?.text) {
        ctx.fillText(extraOptions.text, x, y);
    }
    ctx.closePath();
    ctx.stroke();
    resetColours(ctx);
}

export type Circle = {
    shapeType: 'Circle';
    position: Position;
    radius: number;
}

export function drawCircle(
    ctx: CanvasRenderingContext2D,
    {position:{x,y},radius}: Omit<Circle, 'shapeType'>,
    _?: ExtraRenderOptions
) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
    resetColours(ctx);
}

export type Rectangle = {
    shapeType: 'Rectangle';
    position: Position;
    width: number;
    height: number;
}

export function drawRectangle(
    ctx: CanvasRenderingContext2D,
    {position:{x,y},width,height}: Omit<Rectangle, "shapeType">,
    extraOptions?: ExtraRenderOptions
) {
    if (extraOptions?.strokeColour) {
        ctx.strokeStyle = extraOptions.strokeColour;
    }

    ctx.beginPath();
    ctx.rect(x, y, width, height);
    if (extraOptions?.fillColour) {
        ctx.fillStyle = extraOptions.fillColour;
        ctx.fillRect(x, y, width, height);
    }
    ctx.stroke();
    resetColours(ctx);
}