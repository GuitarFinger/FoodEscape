import { ESceneName } from "./mod/enum";

/**
 * @module 结算
 */
// ============================ 导入


// ============================ 常量定义
const {ccclass, property} = cc._decorator;


// ============================ 变量定义


// ============================ 类定义
@ccclass
export default class Account extends cc.Component {
    

    // LIFE-CYCLE CALLBACKS

    // onLoad () {}

    start () {
        this.bindListener();
    }

    // update (dt) {}
    // LIFE-CYCLE CALLBACKS

    bindListener = () => {
        const btnGiveUp = this.node.getChildByName('box_account')
                                   .getChildByName('btn_giveUp');

        btnGiveUp.on(cc.Node.EventType.TOUCH_START, this.backToMainMenuScene);
    }

    backToMainMenuScene = () => {
        cc.director.loadScene(ESceneName.MAIN_MENU);
    }

}


// ============================ 组件定义


// ============================ 方法定义


// ============================ 导出


// ============================ 立即执行

