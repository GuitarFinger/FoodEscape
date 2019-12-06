import { ESceneName, EMsg, CGame } from "./mod/enum";
import { ScreenTips } from "./mod/screentips";
import { Global } from "./mod/global";
import { GoldMachine } from "./mod/gameutils";

// ============================ 导入

// ============================ 类型定义
type TPage = 'task' | 'rank' | 'sign' | 'skin' | 'countdown';

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

    @property({ type: cc.Prefab, displayName: '倒计时界面预制体' })
    countdownPageFab: cc.Prefab = null;

    @property({ type: cc.Prefab, displayName: '弹出提示预制体' })
    screenTipsPreFab: cc.Prefab = null;

    @property({ type: cc.Prefab, displayName: '升级泡泡预制体' })
    bubbleUpgradePF: cc.Prefab = null;

    @property({ type: cc.Prefab, displayName: '换肤泡泡预制体' })
    bubbleChangeSkinPF: cc.Prefab = null;

    @property({ type: cc.Prefab, displayName: '物理金币预制体' })
    phyGoldPF: cc.Prefab = null;

    @property({ type: cc.ProgressBar, displayName: '金币产出进度条节点' })
    progressNode: cc.ProgressBar = null;

    /**任务界面 */
    taskPage: cc.Node = null;
    /**排行榜界面 */
    rankPage: cc.Node = null;
    /**签到界面 */
    signPage: cc.Node = null;
    /**皮肤界面 */
    skinPage: cc.Node = null;
    /**金币数量文字 */
    textGoldNum: cc.Label = null;

    /**当前打开的页面 */
    nowPage: TPage = null;

    /**是否被销毁 */
    isDestory: boolean = true;

    // ======LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.isDestory = false;
        this.textGoldNum = this.node.getChildByName('basePage')
                                    .getChildByName('gold')
                                    .getChildByName('label').getComponent(cc.Label);
        this.bindListener();

        ScreenTips.screenTipPreFab = this.screenTipsPreFab;
        
        Global.emitter.dispatch(EMsg.GAME_START);

        Global.goldMachine = Global.goldMachine || new GoldMachine(null, null, EMsg.UPDATE_GOLD_PRECENT, EMsg.CREATE_GOLD);

        Global.emitter.register({
            [EMsg.UPDATE_GOLD_PRECENT]: this.updatePropgress,
            [EMsg.CREATE_GOLD]: this.createGold
        });
    }

    start () {

    }

    // update (dt) {}

    onDestroy () {
        this.isDestory = true;

        Global.emitter.remove(EMsg.UPDATE_GOLD_PRECENT);
        Global.emitter.remove(EMsg.CREATE_GOLD);
    }
    // ======LIFE-CYCLE CALLBACKS:

    bindListener = () => {
        const basePageNode = this.node.getChildByName('basePage');
        const leftMenuNode = basePageNode.getChildByName('leftMenu');
        const playerNode = basePageNode.getChildByName('player');
        const btnStartGameNode = basePageNode.getChildByName('btnStartGame');
        const boxAddTime = basePageNode.getChildByName('box_addTime');

        pageTypes.forEach(type => {
            leftMenuNode.getChildByName(type).on(cc.Node.EventType.TOUCH_START, () => {
                this.openPage(type);
            });
        });
        playerNode.on(cc.Node.EventType.TOUCH_START, () => {
            this.openPage('skin');
        });

        btnStartGameNode.on(cc.Node.EventType.TOUCH_START, this.loadMainGameScene);

        boxAddTime.on(cc.Node.EventType.TOUCH_START, this.goldAccelerate);
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

    updatePropgress = (precent: number) => {
        if (this.isDestory) return;

        this.progressNode.progress = precent;
        // console.log(precent);
    }

    createGold = () => {
        if (this.isDestory) return;

        this.node.getChildByName('basePage').addChild(cc.instantiate(this.phyGoldPF));
        this.textGoldNum.string = `${(Global.goldMachine as GoldMachine).createNum}`;
        // console.log('create gold');
    }

    goldAccelerate = () => {
        (Global.goldMachine as GoldMachine).accelerate(CGame.GOLD_OUTPUT_ACC);
    }
}


// ============================ 组件定义


// ============================ 方法定义


// ============================ 导出


// ============================ 立即执行

