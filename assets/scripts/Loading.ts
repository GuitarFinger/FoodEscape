/**
 * @module 加载
 */

// ======================== 导入
import { ESceneName } from "./Enum";

// ============================ 常量定义
const {ccclass, property} = cc._decorator;

// ============================ 变量定义

// ============================ 类定义
@ccclass
export default class Loading extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    @property(cc.ProgressBar)
    loadBar: cc.ProgressBar = null;

    onLoad () {
        const collisionMgr = cc.director.getCollisionManager();
        
        collisionMgr.enabled = true;
        collisionMgr.enabledDebugDraw = true;

    }

    start () {
        this.handleLoading();
    }

    // update (dt) {}

    handleLoading = () => {
        const progressCB = (completeCount: number, totalCount: number, item: any) => {
            const loadProgress = completeCount / totalCount;
            this.loadBar.progress = loadProgress;
        };

        const completeCB = (error: Error, resource: any[], urls: string[]) => {
            if (error) {
                console.log(error);
                return;
            }
            cc.director.preloadScene(ESceneName.MAIN_MENU, () => {
                cc.director.loadScene(ESceneName.MAIN_MENU);
            });
        };

        cc.loader.loadResDir('/', progressCB, completeCB);
    }

}

// ============================ 方法定义

// ============================ 立即执行

