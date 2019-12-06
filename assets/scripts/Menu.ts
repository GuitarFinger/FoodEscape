import { ESceneName, EMsg, CGame, DTip } from "./mod/enum";
import { ScreenTips } from "./mod/screentips";
import { Global } from "./mod/global";
import { GoldMachine } from "./mod/gameutils";
import DB from "./mod/db";
import { MenuModel } from "./GameModel";
import { CFG_BUILD_LEVEL } from "./config/buildLevelCfg";

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

    @property({ type: cc.Label, displayName: '建筑等级节点' })
    buildLvNode: cc.Label = null;

    @property({ type: cc.Label, displayName: '金币数量文字' })
    goldNumNode: cc.Label = null;

    @property({ type: cc.Label, displayName: '钻石数量文字' })
    diamondNumNode: cc.Label = null;

    @property({ type: cc.Label, displayName: '金币产出率文字' })
    diamondRatio: cc.Label = null;

    @property({ type: cc.Label, displayName: '升级消耗文字' })
    buildUpgradeCost: cc.Label = null;

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

    /**是否被销毁 */
    isDestory: boolean = true;

    // ======LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.isDestory = false;
        this.bindListener();

        ScreenTips.screenTipPreFab = this.screenTipsPreFab;
        
        Global.emitter.dispatch(EMsg.GAME_START);

        Global.goldMachine = Global.goldMachine || new GoldMachine(null, null, EMsg.UPDATE_GOLD_PRECENT, EMsg.CREATE_GOLD);

        Global.emitter.register({
            [EMsg.UPDATE_GOLD_PRECENT]: this.updatePropgress,
            [EMsg.CREATE_GOLD]: this.createGold,
            [EMsg.COLLECT_GOLD]: this.collectGold
        });
    }

    start () {
        this.updateBase();
        this.createNoCreateGold();
    }

    // update (dt) {}

    onDestroy () {
        this.isDestory = true;

        Global.emitter.remove(EMsg.UPDATE_GOLD_PRECENT);
        Global.emitter.remove(EMsg.CREATE_GOLD);
        Global.emitter.remove(EMsg.COLLECT_GOLD);
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

    updateBase = () => {
        const cfgKeys = Object.keys(CFG_BUILD_LEVEL);
        const maxLv = cfgKeys[cfgKeys.length - 1];
        const nowLv = DB.data.player.build_lv >= maxLv ? maxLv : DB.data.player.build_lv;
        const cfgCost = CFG_BUILD_LEVEL[nowLv];


        this.buildLvNode.getComponent(cc.Label).string = `${DB.data.player.build_lv}`;
        this.goldNumNode.getComponent(cc.Label).string = `${DB.data.player.gold}`;
        this.diamondNumNode.getComponent(cc.Label).string = `${DB.data.player.diamond}`;
        this.diamondRatio.getComponent(cc.Label).string = `1/(5秒)`;
        this.buildUpgradeCost.getComponent(cc.Label).string = `${nowLv >= maxLv ? '满级' : cfgCost.cost}`;
    }

    updatePropgress = (precent: number) => {
        if (this.isDestory) return;

        this.progressNode.progress = precent;
        // console.log(precent);
    }

    createGold = () => {
        if (this.isDestory) return;

        this.node.getChildByName('basePage').addChild(cc.instantiate(this.phyGoldPF));
        
        // console.log('create gold');
    }

    collectGold = () => {
        const goldVal = CFG_BUILD_LEVEL[DB.data.player.build_lv].goldVal;
        this.goldNumNode.getComponent(cc.Label).string = `${DB.data.player.gold}`;
        Global.emitter.dispatch(EMsg.SCREEN_TIPS, new DTip(this.node, `金币+${goldVal}`));
    }

    goldAccelerate = () => {
        (Global.goldMachine as GoldMachine).accelerate(CGame.GOLD_OUTPUT_ACC);
    }

    createNoCreateGold = () => {
        const noCreateNum = DB.data.player.no_collect_gold;

        if (noCreateNum <= 0) return;

        for (let i = 0; i < noCreateNum; i++) {
            this.node.addChild(cc.instantiate(this.phyGoldPF));
        }
    }

    isCanUpgradeBuild = () => {
        const cfgKeys = Object.keys(CFG_BUILD_LEVEL);
        const maxLv = cfgKeys[cfgKeys.length - 1];
        const nowLv = DB.data.player.build_lv >= maxLv ? maxLv : DB.data.player.build_lv;
        const cfgCost = CFG_BUILD_LEVEL[nowLv];

        if (nowLv >= Number(maxLv)) {
            Global.emitter.dispatch(EMsg.SCREEN_TIPS, new DTip(this.node, `已经满级, 无法升级`));
            return;
        }

        if (cfgCost.cost > DB.data.player.diamond) {
            Global.emitter.dispatch(EMsg.SCREEN_TIPS, new DTip(this.node, `钻石不足, 无法升级`));
            return;
        }

        return true;
    }

    upgradeBuild () {
        if (!this.isCanUpgradeBuild()) return;

        const cost = Number(CFG_BUILD_LEVEL[DB.data.player.build_lv].cost);
        MenuModel.upgradeBuild(
            cost,
            () => {
                Global.emitter.dispatch(EMsg.SCREEN_TIPS, new DTip(this.node, `升级成功`));
                this.updateBase();
            }
        );
    }
}


// ============================ 组件定义


// ============================ 方法定义


// ============================ 导出


// ============================ 立即执行

