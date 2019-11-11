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
        cc.loader.loadResDir('/',
            (completeCount: number, totalCount: number, item: any) => {
                const loadProgress = completeCount / totalCount;
                this.loadBar.progress = loadProgress;
            },
            (error: Error, resource: any[], urls: string[]) => {
                // console.log(error);
                // console.log(resource);
                // console.log(urls);
                cc.director.preloadScene(ESceneName.MAIN_MENU, () => {
                    cc.director.loadScene(ESceneName.MAIN_MENU);
                });
            }
        )
    }

}

// ============================ 方法定义

// ============================ 立即执行

