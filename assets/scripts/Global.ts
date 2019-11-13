// /**
//  * 方法列表
//  */
/**
 * @class 发射器
 */
class Emitter {
    private _funcTable: any = {};

    /**
     * 注册
     * @param obj 
     */
    public register(obj: Object) {
        for (let key in obj) {

            if (!this._funcTable[key]) {
                this._funcTable[key] = [];
            }

            this._funcTable[key].push(obj[key]);
        }
    }

    /**
     * 分发
     */
    public dispatch(key: string, data?: any) {
        const funcArr: any[] = this._funcTable[key];

        if (!funcArr) return;

        funcArr.forEach(func => {
            func && func(data);
        });
    }

    /**
     * 移除
     * @param func 
     */
    public remove(key: string, func?: Function) {
        const funcArr: Function[] = this._funcTable[key];

        if (!funcArr || !funcArr.length) return;

        if (!func) {
            delete this._funcTable[key];
            return;
        }

        const funcIdx = funcArr.indexOf(func);

        if (funcIdx >= 0) {
            funcArr.splice(funcIdx, 1);
        }
    }
}

/**
 * 全局变量
 */
export const Global = {
    /**发射器 */
    emitter: new Emitter(),
    /**
     * 米/度
     */
    _meterPerAngle: 0,

    get meterPerAngle(): number {
        return this._meterPerAngle;
    },
    set meterPerAngle(val) {
        this._meterPerAngle = val;
    },

    /**
     * 初始速度
     */
    _initSpeed: 40,

    get initSpeed(): number {
        return this._initSpeed;
    },
    set initSpeed(val) {
        if (val !== this._initSpeed) {
            this._initSpeed = val;
        }
    },

    /**
     * 速度比例
     */
    _speedRatio: 1,

    get speedRatio(): number {
        return this._speedRatio;
    },
    set speedRatio(val) {
        if (this._speedRatio !== val) {
            this._speedRatio = val;

            (this.emitter as Emitter).dispatch('msgSpeedChange');
        }
    },

    /**道具池 */
    propPool: new cc.NodePool(),

    /**障碍池 */
    obstaclePool: new cc.NodePool(),

};