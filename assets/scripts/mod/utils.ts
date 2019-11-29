import { CGame, TProp, TPoint, TDuadrant, ETProp } from "./enum";
import { Global } from "./global";

/**
 * @module 通用工具
 */
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
     * @TODO 用二分法
     * @param val 判断值
     * @param arr 判断的区间
     * @param key 判断key
     * @returns 区间索引
     */
    public static judgeSection = (val: number, arr: any[], key?: string): number => {
        
        for (let i = 0; i < arr.length; i++) {
            const tempVal = key ? arr[i][key] : arr[i];
            if (val < tempVal) {
                return i;
            }
        }

        return arr.length - 1;
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

        // angle = Utils.convertAngle(angle);

        // if (angle === 0 || angle === 90 || angle === 180 || angle === 270) {
        //     duadrant = 0;
        // } else {
        //     duadrant = ((Utils.judgeSection(angle, [0, 90, 180, 270]) + 1) as TDuadrant);
        // }

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

    /**
     * 首字母大写
     */
    public static FirstWordToUpperCase = (words: string):string => {
        return words.charAt(0).toUpperCase() + words.slice(1);
    }

    /**
     * 节点旋转
     * @param 节点持续时间
     */
    public static nodeRotateBy = (node: cc.Node, duration: number = 2, angle: number = 360) => {
        const repeatRotateBy = cc.repeatForever(cc.rotateBy(duration, angle));

        node.runAction(repeatRotateBy);
    }

    /**
    * 平分角度
    * @param 角度1
    * @param 角度2
    * @returns 每份角度
    */
    public static divideAngle = (angle1: number, angle2: number, partNum: number): number => {
        return Math.abs(Math.abs(angle1) - Math.abs(angle2)) / CGame.INIT_DISTANCE;
    }

    /**
     * 获取一定范围内的随机整数
     * @param min
     * @param max
     * @returns {number}
     */
    public static getRangeRandom = (min: number, max: number): number => {
        return Math.floor(min + Math.random() * (max - min))
    }

    /**
     * 修改图片(图片来自图集)
     */
    public static modifyImageFromAltas = (node: cc.Node, altasName: string, imgName: string) => {
        node.getComponent(cc.Sprite).spriteFrame = Global.spriteAtlasMap.get(altasName).getSpriteFrame(imgName);
    };

    /**计算两点之间的距离 */
    public static caclToPointDistance = (point1: TPoint, point2: TPoint) => {
        return Math.sqrt( Math.pow(Math.abs(point1.x - point2.x), 2) +
                          Math.pow(Math.abs(point1.y - point2.y), 2) );
    }
}