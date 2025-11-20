export interface Shape {
    shapeType: string;
    x: number;
    y: number;
    strokeColour?: string;
    fillColour?: string;
}

export type EquilateralTriangle = {
    shapeType: 'EquilateralTriangle';
    x: number;
    y: number;
    sideLength: number;
    angle: number;
    strokeColour: string;
}

const resetColours = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black';
}

export function drawEquilateralTriangle(ctx: CanvasRenderingContext2D, {x,y,angle,sideLength, strokeColour}: EquilateralTriangle) {
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
    ctx.strokeStyle = strokeColour;
    ctx.closePath();
    ctx.stroke();
    resetColours(ctx);
}

export type Circle = {
    shapeType: 'Circle';
    x: number;
    y: number;
    radius: number;
}

export function drawCircle(ctx: CanvasRenderingContext2D,{x,y,radius}: Circle) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
    resetColours(ctx);
}

export type Rectangle = {
    shapeType: 'Rectangle';
    x: number;
    y: number;
    width: number;
    height: number;
}

export function drawRectangle(ctx: CanvasRenderingContext2D, {x,y,width,height}: Rectangle) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.stroke();
    resetColours(ctx);
}