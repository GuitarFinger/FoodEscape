import { Counter } from "./mod/counter";
import { CGame } from "./mod/enum";
import { Global } from "./mod/global";

// ============================ 导入


// ============================ 常量定义
const {ccclass, property} = cc._decorator;


// ============================ 变量定义


// ============================ 类定义
@ccclass
export default class Ads extends cc.Component {
    
    /**计数器 */
    private _counter: Counter = null;
    /**最大数 */
    private _maxCount: number = 15;
    /**结束回调 */
    private _endCallback: Function = null;
    /**关闭页面回调 */
    private _closeCallback: Function = null;

    init = (endCallback: Function, closeCallback?: Function) => {
        this._endCallback = endCallback;
        this._closeCallback = closeCallback || null;
    }
    // LIFE-CYCLE CALLBACKS
    // onLoad () {}

    start () {
        
        const textNode = this.node.getChildByName('text_cd').getComponent(cc.Label);

        this._maxCount = CGame.ADS_DURATION;
        this._counter = new Counter(this.updateCountdown, this._maxCount, this.endCountdown, textNode);

        this.bindListener();

        Global.autoCounter.add(this._counter);
    }

    // update (dt) {}

    onDestroy () {
        this._counter.setInvalid();
        this._counter = null;

        this.resetData();
    }
    // LIFE-CYCLE CALLBACKS

    /**
     * 绑定监听
     */
    bindListener = () => {
        const bgOpacity = this.node.getChildByName('bg_opacity');
        const textClose = this.node.getChildByName('text_close');

        bgOpacity.on(cc.Node.EventType.TOUCH_START, () => {});
        textClose.on(cc.Node.EventType.TOUCH_START, this.closePage);
    }

    /**
     * 更新倒计时
     */
    updateCountdown = (num: number, node: cc.Label) => {
        node.string = `${this._maxCount - num}`;
    }

    /**
     * 结束倒计时
     */
    endCountdown = (num: number, node: cc.Label) => {
        this.node.destroy();

        this._endCallback && this._endCallback();
    }

    /**
     * 关闭页面
     */
    closePage = () => {
        this._counter.setInvalid();
        this.node.destroy();
    }

    resetData = () => {
        this._counter = null;
        this._endCallback = null;
        this._closeCallback = null;
    }
}


// ============================ 组件定义


// ============================ 方法定义


// ============================ 导出


// ============================ 立即执行