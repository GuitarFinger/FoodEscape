// ============================ 导入


// ============================ 常量定义
const {ccclass, property} = cc._decorator;


// ============================ 变量定义


// ============================ 类定义
@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // =====LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.bindListener();
    }

    start () {

    }

    // update (dt) {}
    // =====LIFE-CYCLE CALLBACKS:

    /**
     * 绑定监听
     */
    bindListener = () => {
        this.node.getChildByName('opacityBg').on(cc.Node.EventType.TOUCH_START, this.closePage);
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

