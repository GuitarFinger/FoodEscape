import { Constants, TProp, TPoint, TDuadrant } from "./Enum";
import { Global } from "./Global";

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

    /**
     * 获取一定范围内的随机整数
     * @param min
     * @param max
     * @returns {number}
     */
    public static getRangeRandom = (min: number, max: number): number => {
        return Math.floor(min + Math.random() * (max - min))
    }
}

/**
 * @TODO 对象池 后面没有变动可以把这几个方法合成一个
 */
export class Factory {
    /**创建距离道具角度 */
    static createAngle: any = {
        addDist: null,
        diamond: null
    };
    /**创建其它道具时间 */
    static createOtherPropTime: number = null;

    /**
     * 生成玩家
     * @param 预制体
     * @parent 父节点
     */
    static createPlayer = (preFab: cc.Prefab, parent: cc.Node): cc.Node => {
        const player = cc.instantiate(preFab);

        parent.addChild(player);

        return player;
    }

    /**
     * 生成敌人
     * @param 预制体
     * @parent 父节点
     */
    static createEnemy = (preFab: cc.Prefab, parent: cc.Node): cc.Node => {
        const enemy = cc.instantiate(preFab);

        parent.addChild(enemy);

        return enemy;
    }

    /**
     * 判断范围距离[TODO: 判断重合, 自己宽度]
     */
    private static judgeRangeDistance = (nowAngle: number, gap: number, propType: string): boolean => {
        const gapAngle = Global.meterPerAngle * gap;
        const multiple = Math.floor(nowAngle/gapAngle);

        if (!Factory.createAngle[propType]) {
            Factory.createAngle[propType] = Utils.getRangeRandom(multiple*gapAngle, (multiple+1)*gapAngle);

            return false;
        }

        if (Factory.createAngle[propType] && nowAngle < Factory.createAngle[propType]) {
            return false;
        }

        Factory.createAngle[propType] = Utils.getRangeRandom((multiple+1)*gapAngle, (multiple+2)*gapAngle);
        // console.log(`%c ${propType}::${Factory.createAngle[propType]}`, 'background: pink;');

        return true;
    }

    /**
     * 生成道具 [TODO: 判断重合, 自己宽度]
     */
    static createProp = (preFab: cc.Prefab, parent: cc.Node, propType: TProp, radius: number) => {
        // TODO 这里应该用缓冲池
        const prop: cc.Node = cc.instantiate(preFab);

        const ownAngle = Utils.convertAngle(Constants.SECTOR_LEVLE_ANGLE- parent.angle);
        const x = Math.cos(ownAngle * Math.PI / 180) * radius;
        const y = Math.sin(ownAngle * Math.PI / 180) * radius;

        // surface的中心点就在中间 而且原点与圆点与中心点重合故可以这样计算坐标
        prop.getComponent('Prop').init(x, y, ownAngle, propType);

        parent.addChild(prop);

        return prop;
    }

    /**
     * 生成加大距离道具 [TODO: 判断重合, 自己宽度]
     */
    static createAddDistProp = (preFab: cc.Prefab, parent: cc.Node): cc.Node => {
        if (!Factory.judgeRangeDistance(parent.angle, Constants.ADDDIST_GAP_RANGE, 'addDist')) return;

        return Factory.createProp(preFab, parent, 'addDist', Constants.SECOND_RADIUS);
    }

    /**
     * 判断其它道具 [TODO: 判断重合, 自己宽度]
     */
    private static judgeOtherProp = (startTime: number) => {
        const timeLength = (Date.now()-startTime) / 1000;
        const multiple = Math.floor(timeLength/Constants.TIME_GAP_RANGE);

        if (!Factory.createOtherPropTime) {
            Factory.createOtherPropTime = Utils.getRangeRandom(multiple*Constants.TIME_GAP_RANGE, (multiple+1)*Constants.TIME_GAP_RANGE);
            // console.log(`%c time:: ${Factory.createOtherPropTime}`, 'background: pink;');
            return false;
        }

        if (Factory.createOtherPropTime && timeLength < Factory.createOtherPropTime) {
            return false;
        }

        Factory.createOtherPropTime = Utils.getRangeRandom((multiple+1)*Constants.TIME_GAP_RANGE, (multiple+2)*Constants.TIME_GAP_RANGE);

        // console.log(`%c time:: ${Factory.createOtherPropTime}`, 'background: pink;');

        return true;
    }

    /**
     * 生成其它道具 [TODO: 判断重合, 自己宽度]
     */
    static createOtherProp = (preFab: cc.Prefab, parent: cc.Node): cc.Node => {
        if (!Factory.judgeOtherProp(Global.mainGame.startRotateTime)) return;

        return Factory.createProp(preFab, parent, 'magnet', Constants.THIRD_RADIUS);
    }

    /**
     * 生成钻石 [TODO: 判断重合, 自己宽度]
     */ 
    static createDiamond = (preFab: cc.Prefab, parent: cc.Node): cc.Node => {
        const randomNum = Math.random();
        // console.log('boolean: ', tempBoolean)
        if (randomNum > Constants.DIAMOND_ODDS || !Factory.judgeRangeDistance(parent.angle, Constants.DIAMOND_GAP_RANGE, 'diamond')) return;

        return Factory.createProp(preFab, parent, 'diamond', Constants.FIRST_RADIUS);
    }

    /**
     * 判断距离上一次间隔距离 [TODO: 判断重合, 自己宽度]
     */
    static judgeLastGapDistance = (nowAngle: number, gap: number, propType: string): boolean => {
        const gapAngle = Global.meterPerAngle * gap;
        const multiple = Math.floor(nowAngle/gapAngle);

        if (!Factory.createAngle[propType]) {
            Factory.createAngle[propType] = 0;
            Factory.createAngle[propType] = Utils.getRangeRandom(Factory.createAngle[propType], Factory.createAngle[propType] + gapAngle);

            return false;
        }

        if (Factory.createAngle[propType] && nowAngle < Factory.createAngle[propType]) {
            return false;
        }

        Factory.createAngle[propType] = Utils.getRangeRandom(Factory.createAngle[propType], Factory.createAngle[propType] + gapAngle);
        console.log(`%c ${propType}::${Factory.createAngle[propType]}`, 'background: pink;');

        return true;
    }

    /**
     * 生成障碍 [TODO: 判断重合, 自己宽度]
     */
    static createObstacle = (preFab: cc.Prefab, parent: cc.Node): cc.Node => {
        if (!Factory.judgeRangeDistance(parent.angle, Constants.OBSTACLE_GAP_RANGE, 'obstacle')) return;

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