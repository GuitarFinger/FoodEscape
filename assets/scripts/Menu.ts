import { ESceneName } from "./Enum";

// ============================ 导入

// ============================ 类型定义
type TPage = 'task' | 'rank' | 'sign' | 'skin';

// ============================ 常量定义
const {ccclass, property} = cc._decorator;
const pageTypes: TPage[] = ['task', 'rank', 'sign'];


// ============================ 变量定义


// ============================ 类定义
@ccclass
export default class Menu extends cc.Component {
    @property({ type: cc.Prefab, displayName: '任务界面预制体' })
    taskPageFab: cc.Prefab = null;

    @property({ type: cc.Prefab, displayName: '排行界面预制体' })
    rankPageFab: cc.Prefab = null;

    @property({ type: cc.Prefab, displayName: '签到界面预制体' })
    signPageFab: cc.Prefab = null;

    @property({ type: cc.Prefab, displayName: '皮肤界面预制体' })
    skinPageFab: cc.Prefab = null;

    /**任务界面 */
    taskPage: cc.Node = null;
    /**排行榜界面 */
    rankPage: cc.Node = null;
    /**签到界面 */
    signPage: cc.Node = null;
    /**皮肤界面 */
    skinPage: cc.Node = null;

    /**当前打开的页面 */
    nowPage: TPage = null; 

    // ======LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.bindListener();
    }

    start () {

    }

    // update (dt) {}
    // ======LIFE-CYCLE CALLBACKS:

    bindListener = () => {
        const basePageNode = this.node.getChildByName('basePage');
        const leftMenuNode = basePageNode.getChildByName('leftMenu');
        const playerNode = basePageNode.getChildByName('player');
        const btnStartGameNode = basePageNode.getChildByName('btnStartGame');

        pageTypes.forEach(type => {
            leftMenuNode.getChildByName(type).on(cc.Node.EventType.TOUCH_START, () => {
                this.openPage(type);
            });
        });
        playerNode.on(cc.Node.EventType.TOUCH_START, () => {
            this.openPage('skin');
        });

        btnStartGameNode.on(cc.Node.EventType.TOUCH_START, this.loadMainGameScene);
    }

    /**打开页面 */
    openPage = (pageType: TPage) => {
        const pageName = <TPage>`${pageType}Page`;

        if (this.nowPage) {
            (this[this.nowPage] as cc.Node).destroy();
            this[this.nowPage] = null;
        }

        this.nowPage = pageName;

        this[pageName] = cc.instantiate(this[`${pageType}PageFab`]);
        this.node.addChild(this[pageName]);
    }
    
    loadMainGameScene = () => {
        cc.director.preloadScene(ESceneName.MAIN_GAME, () => {
            cc.director.loadScene(ESceneName.MAIN_GAME);
        });
    }
}


// ============================ 组件定义


// ============================ 方法定义


// ============================ 导出


// ============================ 立即执行

