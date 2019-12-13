import { Global } from "./mod/global";
import { EMsg } from "./mod/enum";
import DB from "./mod/db";
import { CFG_BUILD_LEVEL } from "./config/buildLevelCfg";

// ============================ 导入


// ============================ 常量定义
const {ccclass, property} = cc._decorator;


// ============================ 变量定义


// ============================ 类定义
@ccclass
export default class Phygold extends cc.Component {
    // LIFE-CYCLE CALLBACKS

    // onLoad () {}

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.getGold);
    }

    // update (dt) {}
    // LIFE-CYCLE CALLBACKS
    onHandleTouchStart () {
        this.getGold();
    }

    getGold = () => {
        const goldVal = CFG_BUILD_LEVEL[DB.data.player.build_lv].goldVal;

        this.node.destroy();
        
        DB.data.player.gold += goldVal;
        DB.data.player.no_collect_gold -= 1;
        DB.data.player.no_collect_gold = DB.data.player.no_collect_gold < 0 ? 0 : DB.data.player.no_collect_gold;

        Global.goldMachine.collectGold();
        Global.emitter.dispatch(EMsg.COLLECT_GOLD);
    }
}


// ============================ 组件定义


// ============================ 方法定义


// ============================ 导出


// ============================ 立即执行

