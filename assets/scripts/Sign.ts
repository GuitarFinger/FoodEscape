import { ESceneName } from "./Enum";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SignIn extends cc.Component {

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
        this.node.getChildByName('box_sign').on(cc.Node.EventType.TOUCH_START, () => {});
    }

    /**
     * 关闭页面
     */
    closePage = () => {
        this.node.destroy();
    }

    getDoubleSignAward () {
        cc.director.preloadScene(ESceneName.MAIN_GAME, () => {
            cc.director.loadScene(ESceneName.MAIN_GAME);
        });
    }
}
