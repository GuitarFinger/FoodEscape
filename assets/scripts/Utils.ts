/**
 * @module 通用工具
 */

type Point = { x: number, y: number };

export class Utils {
    /**
     * 获取两点与水平面的角度
     */
    public static getTowPointerAngle = (point1: Point, point2: Point) => {
        return Math.atan2((point1.y - point2.y), (point2.x - point1.x)) * (180/Math.PI);
    }

    /**
     * 判断区间
     */
    public static judgeSection = (compareVal: number, compareArr: any[], compareKey?: string): number => {
        const len = compareArr.length;

        let left = 0;
        let right = len - 1;

        while(left <= right) {
            const center = Math.floor((left+right)/2);
            const centerVal = compareKey ? compareArr[center][compareKey] : compareArr[center];

            if (compareVal < centerVal) {
                right = center - 1;
            } else {
                left = center + 1;
            }
        }

        return right;
    }
}