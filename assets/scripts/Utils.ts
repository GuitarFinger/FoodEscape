/**
 * @module 通用工具
 */

type Point = { x: number, y: number };

export class Utils {
    public static getTowPointerAngle = (point1: Point, point2: Point) => {
        return Math.atan2((point1.y - point2.y), (point2.x - point1.x)) * (180/Math.PI);
    }
}