/**
 * @module 通用工具
 */

type Point = { x: number, y: number };

export class Utils {
    /**
     * 获取两点与水平面的角度
     * @param point1 点
     * @param point2 点
     */
    public static getTowPointerAngle = (point1: Point, point2: Point) => {
        return Math.atan2((point1.y - point2.y), (point2.x - point1.x)) * (180/Math.PI);
    }

    /**
     * 判断区间
     * @param judgeVal 判断值
     * @param judgeArr 判断的区间
     * @param judgeKey 判断key
     */
    public static judgeSection = (judgeVal: number, judgeArr: any[], judgeKey?: string): number => {
        const len = judgeArr.length;

        let left = 0;
        let right = len - 1;

        while(left <= right) {
            const center = Math.floor((left+right)/2);
            const centerVal = judgeKey ? judgeArr[center][judgeKey] : judgeArr[center];

            if (judgeVal < centerVal) {
                right = center - 1;
            } else {
                left = center + 1;
            }
        }

        return right;
    }
}