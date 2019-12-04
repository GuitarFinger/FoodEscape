/**
 * @module 加载
 */

// ======================== 导入
import { ESceneName } from "./mod/enum";
import DB from "./mod/db";
import { Global } from "./mod/global";

// ============================ 常量定义
const {ccclass, property} = cc._decorator;

// ============================ 变量定义

// ============================ 类定义
@ccclass
export default class Loading extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    @property({type: cc.ProgressBar, displayName: '进度条'})
    loadBar: cc.ProgressBar = null;
    /**广告倒计时 */
    @property({ type: cc.Prefab, displayName: '广告倒计时' })
    adsPF: cc.Prefab = null;

    onLoad () {
        const collisionMgr = cc.director.getCollisionManager();
        
        collisionMgr.enabled = true;
        // collisionMgr.enabledDebugDraw = true;
        
        Global.adsPF = this.adsPF;
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
