
/**
 * 计数器
 */
export class Counter {
    /**
     * 累计数
     */
    private _count: number = 0;

    /**
     * 最大计数
     */
    private _maxCount: number = null;

    /**
     * 处理方法
     */
    private _handleFunc: Function = null;

    /**
     * 结束回调
     */
    private _endFunc: Function = null;

    /**
     * 增量
     */
    private _step: number = 1;

    /**
     * 是否失效
     */
    public isInvalid: boolean = false;
    
    /**
     * 
     * @param handleFunc 处理方法
     * @param maxCount 最大计数
     * @param endFunc 结束方法
     * @param step 间隔
     */
    constructor (handleFunc?: Function, maxCount?: number, endFunc?: Function, step: number = 1) {
        this._handleFunc = handleFunc || null;
        this._maxCount = maxCount || 0;
        this._endFunc = endFunc || null;
        this._step = step;
    }

    increase = () => {
        if (this.isInvalid) return;

        this._count += this._step;
        
        this._handleFunc && this._handleFunc(this._count);

        if (this._maxCount && this._count >= this._maxCount) {
            this.isInvalid = true;
            this._endFunc && this._endFunc(this._count);
            this.resetData();
        }

        return this._count;
    }

    getCount = () => {
        return this._count;
    }
    
    /**
     * 设置失效
     */
    setInvalid = () => {
        this.isInvalid = true;
    }

    /**
     * 重置计数
     */
    resetCount = () => {
        this._count = 0;
    }

    modifyStep = (step: number) => {
        this._step = step;
    }

    private resetData () {
        this._handleFunc = null;
        this._endFunc = null;
        this._count = 0;
        this._maxCount = 0;
    }
}

/**
 * @class 自动计数器
 */
export class AutoCounter {
    /**
     * 时间间隔毫秒
     */
    private _timeStep: number = 1000;
    /**
     * 是否运行
     */
    private _isRun: boolean;
    /**
     * setTimeout id
     */
    private _timer: any;
    /**
     * 所有的计数器
     */
    counters: Counter[];

    /**
     * 
     * @param timeStep 时间间隔
     */
    constructor (timeStep: number = 1000) {
        this._timeStep = timeStep;

        this.init();
    }

    /**
     * 初始化
     */
    init = () => {
        this._isRun = false;
        this._timer = null;
        this.counters = [];
    }

    /**
     * 添加
     * @param counter 
     */
    add = (counter: Counter) => {
        this.counters.push(counter);

        if (this._isRun) return;

        this.run();
    }

    /**
     * 运行
     */
    run = () => {
        this._timer && clearTimeout(this._timer);
        this._timer = null;

        if (!this.counters.length) {
            this._isRun = false;
        } else {
            this._isRun = true;

            for (let i = 0; i < this.counters.length; i++) {
                const counter = this.counters[i];

                counter.increase();

                if (counter.isInvalid) {
                    this.counters.splice(i, 1);
                    i--;
                }
            }

            this._timer = setTimeout(this.run, this._timeStep);
        }
    }

    /**
     * 重置
     */
    reset = () => {
        this._isRun = false;
        this._timer = null;
        this.counters = [];
    }
}