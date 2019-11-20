/**
 * @module 加载
 */

// ======================== 导入
import { ESceneName } from "./Enum";
import DB from "./mod/db";
import { Global } from "./Global";

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
            const content = item.content;
            
            if (content && content instanceof cc.SpriteAtlas) {
                Global.spriteAtlasMap.set(content.name.split('.')[0], content);
            }

            this.loadBar.progress = loadProgress;
        };

        const completeCB = (error: Error, resource: any[], urls: string[]) => {
            if (error) {
                console.log(error);
                return;
            }

            LoadModel.getBaseData(() => {
                cc.director.preloadScene(ESceneName.MAIN_MENU, () => {
                    cc.director.loadScene(ESceneName.MAIN_MENU);
                });
            });
        };

        cc.loader.loadResDir('/', progressCB, completeCB);
    }
}

/**加载模块 */
class LoadModel {
    /**
     * 初始化sign的前端字段
     */
    static initSignDB = () => {
        DB.init('sign', {});
    }

    /**
     * 获取基本数据
     */
    static getBaseData = (callback?: Function) => {
        DB.data.sign = {
            index: 1,
            list: [
                0, 0, 0, 0, 0, 0, 0
            ]
        }

        callback && callback();
    };
}

// ============================ 方法定义

// ============================ 立即执行
LoadModel.initSignDB();
