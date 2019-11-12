/**
 * 方法列表
 */
const _funcTable: any = {};
/**
 * 全局变量
 */
export const Global = {
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
            this.globalDispatch('msgSpeedChange');
        }
    },

    /**
     * 分发方法
     */
    globalDispatch: (key: string, data?: any) => {
        const funcArr: any[] = _funcTable[key];

        if (!funcArr) return;

        funcArr.forEach(func => {
            func && func(data);
        });
    },
    /**
     * 注册方法
     */
    globalRegister: (obj: Object) => {
        for (let key in obj) {

            if (!_funcTable[key]) {
                _funcTable[key] = [];
            }

            _funcTable[key].push(obj[key]);
        }
    }
};