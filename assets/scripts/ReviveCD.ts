import { Counter } from "./mod/counter";
import { Global } from "./mod/global";
import { CGame, ESceneName } from "./mod/enum";

// ============================ 导入


// ============================ 常量定义
const {ccclass, property} = cc._decorator;


// ============================ 变量定义


// ============================ 类定义
@ccclass
export default class ReviveCD extends cc.Component {

    /**计数器 */
    private _counter: Counter = null;
    private _maxCount: number = 15;
    private _step: number = 1;

    // LIFE-CYCLE CALLBACKS

    // onLoad () {
    //     
    // }

    start () {
        const textNode = this.node.getChildByName('box_countdown')
                                  .getChildByName('box_circle')
                                  .getChildByName('text_time')
                                  .getComponent(cc.Label);

        this._counter = new Counter(this.updateCountdown, this._maxCount, this.endCountdown, textNode);

        Global.autoCounter.add(this._counter);
    }



    // update (dt) {}

    onDestroy () {
        this._counter.setInvalid();
        this._counter = null;
    }
    // LIFE-CYCLE CALLBACKS

    updateCountdown = (num: number, node: cc.Label) => {
        node.string = `${CGame.COUNTDOWN_DURATION - num}`;
    }

    /**
     * 结束倒计时
     */
    endCountdown = (num: number, node: cc.Label) => {
        this.node.destroy();

        cc.director.loadScene(ESceneName.MAIN_MENU);
    } 
}


// ============================ 组件定义


// ============================ 方法定义


// ============================ 导出


// ============================ 立即执行

