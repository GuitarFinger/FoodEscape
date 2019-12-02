import { Counter } from "./mod/counter";
import { Global } from "./mod/global";

// ============================ 导入


// ============================ 常量定义
const {ccclass, property} = cc._decorator;


// ============================ 变量定义


// ============================ 类定义
@ccclass
export default class Countdown extends cc.Component {

    /**计数器 */
    counter: Counter = null;
    /** */
    // LIFE-CYCLE CALLBACKS

    init (handleFunc?: Function, maxCount?: number, endFunc?: Function, customData?: any, step: number = 1) {
        this.counter = new Counter(handleFunc, maxCount, endFunc, customData, step);
    }

    // onLoad () {
    //     
    // }

    start () {
        Global.autoCounter.add(this.counter);
    }



    // update (dt) {}

    onDestroy () {
        this.counter.setInvalid();
        this.counter = null;
    }
    // LIFE-CYCLE CALLBACKS

}


// ============================ 组件定义


// ============================ 方法定义


// ============================ 导出


// ============================ 立即执行

