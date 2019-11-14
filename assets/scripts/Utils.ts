import { Constants } from "./Enum";

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
        return Math.abs(Math.abs(angle1) - Math.abs(angle2)) / Constants.INIT_DISTANCE;
    }
}

/**
 * @TODO 对象池 后面没有变动可以把这几个方法合成一个
 */
export class Factory {
    /**
     * 生产玩家
     * @param 预制体
     * @parent 父节点
     */
    static producePlayer = (preFab: cc.Prefab, parent: cc.Node): cc.Node => {
        const player = cc.instantiate(preFab);

        parent.addChild(player);

        return player;
    }

    /**
     * 生产敌人
     * @param 预制体
     * @parent 父节点
     */
    static produceEnemy = (preFab: cc.Prefab, parent: cc.Node): cc.Node => {
        const enemy = cc.instantiate(preFab);

        parent.addChild(enemy);

        return enemy;
    }

    /**
     * 生产道具
     */
    static produceProp = (preFab: cc.Prefab, parent: cc.Node): cc.Node => {
        // TODO 这里应该用缓冲池
        const prop: cc.Node = cc.instantiate(preFab);

        const ownAngle = Utils.convertAngle(Constants.SECTOR_LEVLE_ANGLE- parent.angle);
        const x = Math.cos(ownAngle * Math.PI / 180) * Constants.SECOND_RADIUS;
        const y = Math.sin(ownAngle * Math.PI / 180) * Constants.SECOND_RADIUS;

        // surface的中心点就在中间 而且原点与圆点与中心点重合故可以这样计算坐标
        prop.getComponent('Prop').init(x, y, ownAngle, 'coin');

        parent.addChild(prop);

        return prop;
    }

    /**
     * 生产道具
     */
    static produceObstacle = (preFab: cc.Prefab, parent: cc.Node): cc.Node => {
        // TODO 这里应该用缓冲池
        const obstacle: cc.Node = cc.instantiate(preFab);

        const ownAngle = Utils.convertAngle(Constants.SECTOR_LEVLE_ANGLE-parent.angle);
        const x = Math.cos(ownAngle * Math.PI / 180) * Constants.FIRST_RADIUS;
        const y = Math.sin(ownAngle * Math.PI / 180) * Constants.FIRST_RADIUS;

        // surface的中心点就在中间 而且原点与圆点与中心点重合故可以这样计算坐标
        obstacle.getComponent('Obstacle').init(x, y, ownAngle, 'obstacle');

        parent.addChild(obstacle);

        return obstacle;
    }
}