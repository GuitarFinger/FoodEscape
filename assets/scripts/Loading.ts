import { ESceneName } from "./Enum";

// ======================== 导入


// ============================ 常量定义
const {ccclass, property} = cc._decorator;

// ============================ 变量定义

// ============================ 类定义
@ccclass
export default class Loading extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        const collisionMgr = cc.director.getCollisionManager();
        
        collisionMgr.enabled = true;
        collisionMgr.enabledDebugDraw = true;

        cc.director.preloadScene(ESceneName.MAIN_MENU, () => {
            cc.director.loadScene(ESceneName.MAIN_MENU);
        });
    }

    start () {

    }

    // update (dt) {}
}

// ============================ 方法定义

// ============================ 立即执行

