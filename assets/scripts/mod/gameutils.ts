import { TProp, ETProp, CGame, EMsg } from "./enum";
import { Global } from "./global";
import { Utils } from "./utils";
import { Counter } from "./counter";
import Frame from "./frame";

export class FactoryUtils {
    /**
     * 创建角度
     */
    private static angle = {};

    /**
     * 创建时间
     */
    private static time = {};
    /**
     * id计数器
     */
    private static IDCounter = new Counter();
    /**
     * 时间长度
     */
    private static timelen: number = 0;

    /**
     * 计算时间间隔
     */
    public static calcTimeGap = (timeInterval: number, type: string): boolean => {
        let timeLen: number, multiple: number, minTime: number, maxTime: number;

        FactoryUtils.timelen += timeInterval;
        multiple = Math.floor(FactoryUtils.timelen / CGame.TIME_GAP_RANGE);

        if (!FactoryUtils.time[type]) {
            minTime = multiple * CGame.TIME_GAP_RANGE;
            maxTime = (multiple+1) * CGame.TIME_GAP_RANGE;
            FactoryUtils.time[type] = Utils.getRangeRandom(minTime, maxTime);

            return false;
        }

        if (FactoryUtils.time[type] && FactoryUtils.timelen < FactoryUtils.time[type]) return false;

        minTime = (multiple+1) * CGame.TIME_GAP_RANGE;
        maxTime = (multiple+2) * CGame.TIME_GAP_RANGE;
        FactoryUtils.time[type] = Utils.getRangeRandom(minTime, maxTime);

        return true;
    }

    /**
     * 计算距离间隔
     */
    public static calcDistanceGap = (angle: number, gap: number, type: string): boolean => {
        let gapAngle: number, multiple: number, minAngle: number, maxAngle: number;

        gapAngle = Global.meterPerAngle * gap;
        multiple = Math.floor(angle / gapAngle);

        if (!FactoryUtils.angle[type]) {
            minAngle = multiple * gapAngle;
            maxAngle = (multiple + 1) * gapAngle;
            FactoryUtils.angle[type] = Utils.getRangeRandom(minAngle, maxAngle);

            return false;
        }

        if (FactoryUtils.angle[type] && angle < FactoryUtils.angle[type]) return false;

        minAngle = (multiple + 1) * gapAngle;
        maxAngle = (multiple + 2) * gapAngle;
        FactoryUtils.angle[type] = Utils.getRangeRandom(minAngle, maxAngle);

        return true;
    }

    /**
     * 计算概率
     */
    public static calcOdds = (odds: number, flag: boolean = false): boolean => {
        const random = Math.random();
        
        return flag ? odds >= random : odds <= random;
    }

    /**创建道具 */
    public static createProp = (prefab: cc.Prefab, parent: cc.Node, ptype: TProp, radius: number) => {
        let node: cc.Node, angle: number, worldX: number, worldY: number, nodeXY: cc.Vec2, id: number;

        node = cc.instantiate(prefab);
        angle = Utils.convertAngle(CGame.SECTOR_LEVLE_ANGLE);
        worldX = Math.cos(angle * Math.PI / 180) * radius + 375;
        worldY = Math.sin(angle * Math.PI / 180) * radius;
        nodeXY = Global.mainGame.node.convertToNodeSpaceAR(cc.v2(worldX, worldY));
        id = FactoryUtils.IDCounter.increase();

        node.getComponent('Prop').init(
            nodeXY.x, nodeXY.y, angle, ptype, radius, id
        );

        
        Global.createProps[id] = node.getComponent('Prop');

        parent.addChild(node);

        return node;
    }

    public static resetData = () => {
        FactoryUtils.angle = {};
        FactoryUtils.time = {};
    }
}

Global.emitter.register({
    [EMsg.GAME_START]: FactoryUtils.resetData
});

export class Factory {
    /**
     * 玩家
     * @param 预制体
     * @parent 父节点
     */
    public static player = (prefab: cc.Prefab, parent: cc.Node): cc.Node => {
        const node = cc.instantiate(prefab);

        parent.addChild(node);

        return node;
    }

    /**
     * 敌人
     * @param 预制体
     * @parent 父节点
     */
    public static enemy = (prefab: cc.Prefab, parent: cc.Node): cc.Node => {
        const node = cc.instantiate(prefab);

        parent.addChild(node);

        return node;
    }

    /**
     * 道具
     */
    public static prop = (prefab: cc.Prefab, parent: cc.Node, ptype: TProp, refAngle?: number, timeInterval?: number): cc.Node => {
        let node = null;
        switch (ptype) {
            case ETProp.BANANA:
                node = Factory.banana(prefab, parent, ptype, timeInterval);
                break;
            case ETProp.BANANA_PEEL:
                break;
            case ETProp.DIAMOND:
                node = Factory.diamond(prefab, parent, ptype, refAngle);
                break;
            case ETProp.GOLD:
                break;
            case ETProp.MAGNET:
                node = Factory.magnet(prefab, parent, ptype, refAngle);
                break;
            case ETProp.PEPPER:
                node = Factory.pepper(prefab, parent, ptype, refAngle);
                break;
            case ETProp.SHIT:
                node = Factory.shit(prefab, parent, ptype, timeInterval);
                break;
            case ETProp.TRAP:
                node = Factory.trap(prefab, parent, ptype, refAngle);
                break;
        }

        return node;
    }

    /**
     * 钻石(第一层)
     */
    private static diamond = (prefab: cc.Prefab, parent: cc.Node, ptype: TProp, refAngle: number) => {
        if (!FactoryUtils.calcOdds(CGame.DIAMOND_ODDS)) return;

        if (!FactoryUtils.calcDistanceGap(refAngle, CGame.DIAMOND_GAP_RANGE, ptype)) return;

        return FactoryUtils.createProp(prefab, parent, ptype, CGame.FIRST_RADIUS);
    }

    /**
     * 捕兽夹(第一层)
     */
    private static trap = (prefab: cc.Prefab, parent: cc.Node, ptype: TProp, refAngle: number) => {
        if (!FactoryUtils.calcDistanceGap(refAngle, CGame.TRAP_GAP_RANGE, ptype)) return;

        return FactoryUtils.createProp(prefab, parent, ptype, CGame.FIRST_RADIUS);
    }

    /**
     * 香蕉(第二层)
     */
    private static banana = (prefab: cc.Prefab, parent: cc.Node, ptype: TProp, timeInterval: number) => {
        if (!FactoryUtils.calcTimeGap(timeInterval, 'second')) return;

        return FactoryUtils.createProp(prefab, parent, ptype, CGame.SECOND_RADIUS);

    }

    /**
     * 便便(第二层)
     */
    private static shit = (prefab: cc.Prefab, parent: cc.Node, ptype: TProp, timeInterval: number) => {
        if (!FactoryUtils.calcTimeGap(timeInterval, 'second')) return;

        return FactoryUtils.createProp(prefab, parent, ptype, CGame.SECOND_RADIUS);
    }

    /**
     * 磁铁(第三层)
     */
    private static magnet = (prefab: cc.Prefab, parent: cc.Node, ptype: TProp, refAngle: number) => {
        if (!FactoryUtils.calcDistanceGap(refAngle, CGame.THIRD_GAP_RANGE, 'third')) return;

        return FactoryUtils.createProp(prefab, parent, ptype, CGame.THIRD_RADIUS);
    }

    /**
     * 辣椒(第三层)
     */
    private static pepper = (prefab: cc.Prefab, parent: cc.Node, ptype: TProp, refAngle: number) => {
        if (!FactoryUtils.calcDistanceGap(refAngle, CGame.THIRD_GAP_RANGE, 'third')) return;

        return FactoryUtils.createProp(prefab, parent, ptype, CGame.THIRD_RADIUS);
    }
}

/**
 * @classdesc 金币生产器
 */
export class GoldMachine {
    /**
     * 产出率
     */
    private _outputRate: number = CGame.GOLD_OUTPUT_RATE;
    /**
     * 累计时间
     */
    private _totalTime: number = 0;
    /**
     * 阶段时间
     */
    private _stageTime: number = 0;
    /**
     * 超出阶段时间
     */
    private _overStageTime: number = 0;
    /**
     * 产出百分比
     */
    private _precent: number = 0;
    /**
     * 是否暂停
     */
    private _isPaused: boolean = true;
    /**
     * 更新处理方法
     */
    private _handleFunc: Function = null;
    /**
     * 产出处理方法
     */
    private _createFunc: Function = null;
    /**
     * 更新处理消息
     */
    private _handleMsg: EMsg = null;
    /**
     * 产出处理消息
     */
    private _createMsg: EMsg = null;
    /**
     * 循环帧对象
     */
    private _frame: any = null;
    /**
     * 上一次更新时间
     */
    private _lastTime: number = 0;
    /**
     * 产出数
     */
    public createNum: number = 0;

    constructor (handleFunc?: Function, createFunc?: Function, handleMsg?: EMsg, createMsg?: EMsg) {
        this.init();

        this._handleFunc = handleFunc;
        this._createFunc = createFunc;
        this._handleMsg = handleMsg;
        this._createMsg = createMsg;

        this.start();
    }

    init = () => {
        this._outputRate = CGame.GOLD_OUTPUT_RATE * 1000;
        this._totalTime = 0;
        this._stageTime = 0;
        this._overStageTime = 0;
        this._precent = 0;
        this._isPaused = true;
        this._handleFunc = null;
        this._createFunc = null;
        this._handleMsg = null;
        this._createMsg = null;
        this._frame = null;
        this.createNum = 0;
    }

    start = () => {
        this._isPaused = false;
        this.run();
    }

    run = () => {
        if (this._frame) return;

        this._lastTime = Date.now();

        this._frame = Frame.add(() => {
            const nowTime = Date.now();
            const timeInterval = nowTime - this._lastTime;

            this.update(timeInterval);

            this._lastTime = nowTime;
        });
    }

    update = (timeInterval: number) => {
        if (this._isPaused) return;

        this._totalTime += timeInterval;
        this._stageTime += timeInterval;
        this._stageTime += this._overStageTime;

        if (this._stageTime >= this._outputRate) {
            this._overStageTime = this._stageTime - this._outputRate;
            this._stageTime = 0;
            this._precent = 1;
            this.createNum++;

            if (this._createFunc) {
                this._createFunc();
            }
            else if (this._createMsg) {
                Global.emitter.dispatch(EMsg.CREATE_GOLD);
            }

        } else {
            this._overStageTime = 0;
            this._precent = this._stageTime / this._outputRate;
        }


        if (this._handleFunc) {
            this._handleFunc(this._precent)
        }
        else if (this._handleMsg) {
            Global.emitter.dispatch(EMsg.UPDATE_GOLD_PRECENT, this._precent);
        }
    }

    pause = () => {
        this._isPaused = true;
    }

    resume = () => {
        this._isPaused = false;
    }

    /**
     * @method 加速
     * @param val 时间增量(毫秒)
     */
    accelerate = (val: number) => {
        if (isNaN(val)) return;

        this.update(val);
    }

    stop = () => {
        this.pause();

        this._frame && Frame.delete(this._frame);

        this.init();
    }

    getPrecent = (): number => {
        return this._precent;
    }

    collectGold = () => {
        if (this.createNum <= 0) return;

        this.createNum--;
    }
}