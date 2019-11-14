/**
 * @module 通用工具
 */

type TPoint = { x: number, y: number };
type TDuadrant = 0 | 1 | 2 | 3 | 4;

export class Utils {
    /**
     * 获取两点与水平面的角度
     * @param point1 点
     * @param point2 点
     * @returns 两点与水平面的角度
     */
    public static getTowPointerAngle = (point1: TPoint, point2: TPoint) => {
        return Math.atan2((point1.y - point2.y), (point2.x - point1.x)) * (180/Math.PI);
    }

    /**
     * 判断区间
     * @param judgeVal 判断值
     * @param judgeArr 判断的区间
     * @param judgeKey 判断key
     * @returns 区间索引
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

    /**
     * 角度转换
     * @param angle 角度
     * @param isPositive 是否是正向角度
     * @returns 转换后的角度
     */
    public static convertAngle = (angle: number, isPositive: boolean = true): number => {
        let tempAngle: number;

        angle = angle % 360;

        if (isPositive) {
            tempAngle = angle < 0 ?  360 + angle : angle;
        } else {
            tempAngle = angle > 0 ? -360 + angle : angle;
        }

        return tempAngle;
    }

    /**
     * 判断角度象限
     * @param 角度
     * @returns 象限 0: 坐标轴 1,2,3,4对应象限
     */
    public static judgeAngleQuadrant = (angle: number): TDuadrant => {
        let duadrant: TDuadrant;

        angle = Utils.convertAngle(angle);

        if (angle === 0 || angle === 90 || angle === 180 || angle === 270) {
            duadrant = 0;
        } else {
            duadrant = ((Utils.judgeSection(angle, [0, 90, 180, 270]) + 1) as TDuadrant);
        }

        return duadrant;
    }

    /**
     * 获取旋转角度
     * @returns 旋转角度
     */
    public static getRotateAngle = (angle: number):number => {
        angle = Utils.convertAngle(angle);

        return (Math.floor(angle / 90) - 1) * 90 + angle % 90;
    }
}