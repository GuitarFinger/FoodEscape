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
    /**最大数 */
    private _maxCount: number = 15;

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
        this.bindListener();
    }



    // update (dt) {}

    onDestroy () {
        this._counter.setInvalid();
        this._counter = null;
    }
    // LIFE-CYCLE CALLBACKS

    bindListener = () => {
        const btnRevive = this.node.getChildByName('box_countdown')
                                   .getChildByName('btn_revive');
        const boxGiveUp = this.node.getChildByName('box_countdown')
                                   .getChildByName('box_giveup');

        btnRevive.on(cc.Node.EventType.TOUCH_START, () => {
            this.closePage();
            Global.mainGame.createAds();

        });

        boxGiveUp.on(cc.Node.EventType.TOUCH_START, () => {
            this.closePage();
            cc.director.loadScene(ESceneName.ACCOUNT);
        });
    }

    closePage = () => {
        this._counter.setInvalid();
        this.node.destroy();
    }

    updateCountdown = (num: number, node: cc.Label) => {
        node.string = `${CGame.COUNTDOWN_DURATION - num}`;
    }

    /**
     * 结束倒计时
     */
    endCountdown = (num: number, node: cc.Label) => {
        this.closePage();

        cc.director.loadScene(ESceneName.ACCOUNT);
    } 
}


// ============================ 组件定义


// ============================ 方法定义


// ============================ 导出


// ============================ 立即执行

