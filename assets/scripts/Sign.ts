// ============================ 导入
import { ESceneName } from "./Enum";

// ============================ 常量定义
const {ccclass, property} = cc._decorator;


// ============================ 变量定义


// ============================ 类定义
@ccclass
export default class SignIn extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // =====LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.bindListener();
        this.init();
    }

    start () {
        
    }

    // update (dt) {}
    // =====LIFE-CYCLE CALLBACKS:

    init = () => {

    }
    /**
     * 绑定监听
     */
    bindListener = () => {
        this.node.getChildByName('opacityBg').on(cc.Node.EventType.TOUCH_START, this.closePage);
        this.node.getChildByName('box_sign').on(cc.Node.EventType.TOUCH_START, () => {});
    }

    /**
     * 关闭页面
     */
    closePage = () => {
        this.node.destroy();
    }
}


// ============================ 组件定义


// ============================ 方法定义


// ============================ 导出


// ============================ 立即执行


