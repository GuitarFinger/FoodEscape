/**
 * @module 游戏主逻辑
 */
// ============================ 导入
import { Utils } from "./mod/utils";
import { CGame, TProp, ETProp, EMsg } from "./mod/enum";
import { CFG_TIME_SPEED } from "./config/timeSpeedCfg";
import { Global } from "./mod/global";
import { Factory } from "./mod/gameutils";
import Player from "./Player";

// ============================ 常量定义
const {ccclass, property} = cc._decorator;

// ============================ 变量定义


// ============================ 类定义

@ccclass
export default class MainGame extends cc.Component {
    /**地表节点 */
    @property({ type: cc.Node, displayName: '地表' })
    surface: cc.Node = null;
    /**中景节点 */
    @property({ type: cc.Node, displayName: '中景' })
    prospect: cc.Node = null;

    // 预制体
    /**玩家预制体 */
    @property({ type: cc.Prefab, displayName: '玩家预制体' })
    playerPF: cc.Prefab = null;
    /**敌人预制体 */
    @property({ type: cc.Prefab, displayName: '敌人预制体' })
    enemyPF: cc.Prefab = null;
    /**倒计预制体 */
    @property({ type: cc.Prefab, displayName: '倒计预制体' })
    reviveCDPF: cc.Prefab = null;
    /**香蕉预制体 */
    @property({ type: cc.Prefab, displayName: '香蕉预制体' })
    bananaPF: cc.Prefab = null;
    /**香蕉皮预制体 */
    @property({ type: cc.Prefab, displayName: '香蕉皮预制体' })
    banana_peelPF: cc.Prefab = null;
    /**钻石预制体 */
    @property({ type: cc.Prefab, displayName: '钻石预制体' })
    diamondPF: cc.Prefab = null;
    /**金币预制体 */
    @property({ type: cc.Prefab, displayName: '金币预制体' })
    goldPF: cc.Prefab = null;
    /**磁铁预制体 */
    @property({ type: cc.Prefab, displayName: '磁铁预制体' })
    magnetPF: cc.Prefab = null;
    /**辣椒预制体 */
    @property({ type: cc.Prefab, displayName: '辣椒预制体' })
    pepperPF: cc.Prefab = null;
    /**便便预制体 */
    @property({ type: cc.Prefab, displayName: '便便预制体' })
    shitPF: cc.Prefab = null;
    /**捕兽夹预制体 */
    @property({ type: cc.Prefab, displayName: '捕兽夹预制体' })
    trapPF: cc.Prefab = null;

    /**玩家节点 */
    player: cc.Node;
    /**敌人节点 */
    enemy: cc.Node;
    /**复活倒计时节点 */
    reviveCD: cc.Node;
    /**游戏是否暂停 */
    isPaused: boolean = false;
    /**转动开始时间 */
    startRotateTime: number = 0;
    /**上次转动时间 */
    lastRotateTime: number = 0;

    // // LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.createPlayer();
        this.createEnemy();
        // this.player = Factory.player(this.playerPF, this.node);
        // this.enemy = Factory.enemy(this.enemyPF, this.node);

        // this.bindListener();

        Global.mainGame = this;
        Global.initSpeed = CFG_TIME_SPEED[0].speed;
        Global.speedRatio = 1;
        Global.meterPerAngle = Utils.divideAngle(
            this.calcRelativeSurfaceAngle(this.player, 'Player'),
            this.calcRelativeSurfaceAngle(this.enemy, 'Enemy'),
            CGame.INIT_DISTANCE
        );
    }

    start () {
        this.startGame();
    }

    update (timeInterval: number) {
        if (this.isPaused) return;

        // 创建游戏道具
        this.createGameProp(timeInterval);
        // 更新旋转
        this.updateRotate(timeInterval);

    }

    /**
     * 开始游戏
     */
    startGame = () => {
        this.isPaused = false;
        this.startRotateTime = Date.now();
        this.lastRotateTime = Date.now();
    }

    /**
     * 继续游戏
     */
    resumeGame = () => {
        this.isPaused = false;
    }

    /**
     * 暂停游戏
     */
    pauseGame = () => {
        this.isPaused = true;
    }

    /**
     * 结束游戏
     */
    stopGame = () => {
        this.isPaused = true;
        Global.emitter.remove(EMsg.PLAYER_REVIVE, this.createPlayer);

    }

    /**
     * 绑定监听
     */
    bindListener = () => {
        // const player = this.player.getComponent('Player');
        // this.node.on(cc.Node.EventType.TOUCH_START, () => {

        //     if (!this.isPaused) {
        //         !player.isDead && player.jump();
        //     }
        // });
    }

    /**
     * 处理监听开始
     */
    handleTouchstart = (player: Player) => {
        if (this.isPaused) return;

        !player.isDead && player.jump();
    }

    /**
     * 创建玩家
     */
    createPlayer = () => {
        this.player = null;

        this.player = Factory.player(this.playerPF, this.node);

        const player = this.player.getComponent('Player');

        this.node.off(cc.Node.EventType.TOUCH_START);

        this.node.on(cc.Node.EventType.TOUCH_START, () => {

            if (!this.isPaused) {
                !player.isDead && player.jump();
            }
        });
    }

    /**
     * 创建敌人
     */
    createEnemy = () => {
        this.enemy = Factory.enemy(this.enemyPF, this.node);
    }

    /**
     * 计算相对于水平面角度
     */
    calcRelativeSurfaceAngle = (node: cc.Node, componentType: string) => {
        const component = node.getComponent(componentType);
        const pos = (this.node as cc.Node).convertToWorldSpaceAR(node.getPosition());
        const angle = 180 + Utils.getTowPointerAngle({ x: pos.x, y: pos.y }, { x: 375, y: 1334 });

        component.initAngle = component.relativeAngle = angle;

        return angle;
    };
    
    /**
     * 创建游戏道具
     */
    createGameProp = (timeInterval: number) => {
        let secondPtype: TProp, thirdPtype: TProp;

        // 创建钻石
        Factory.prop(this.diamondPF, this.node, ETProp.DIAMOND, this.surface.angle);

        // 创建第二层道具
        secondPtype = CGame.ODDS_BA_SH[Utils.judgeSection(Math.random(), CGame.ODDS_BA_SH, 'odds')].ptype;
        Factory.prop(this[`${secondPtype}PF`], this.node, secondPtype, null, timeInterval);

        // 创建第三层道具
        thirdPtype = CGame.ODDS_PE_MA[Utils.judgeSection(Math.random(), CGame.ODDS_PE_MA, 'odds')].ptype;
        Factory.prop(this[`${thirdPtype}PF`], this.node, thirdPtype, this.surface.angle);
        
        
        // 创建捕兽夹
        Factory.prop(this.trapPF, this.node, ETProp.TRAP, this.surface.angle);
    }

    /**
     * 更新转动
     */
    updateRotate = (timeInterval: number) => {
        let nowTime: number, // 当前时间
            // timeInterval: number, // 时间间隔
            timeLength: number, // 时间长度
            sectionIdx: number, // 时间速度区间
            nowSpeed: number, // 当前速度
            angleIncrement: number; // 角度增量

        // nowTime = Date.now();
        // timeInterval = (nowTime-this.lastRotateTime) / 1000;
        this.lastRotateTime += (timeInterval * 1000);
        timeLength = (this.lastRotateTime-this.startRotateTime) / 1000;
        sectionIdx = Utils.judgeSection(timeLength, CFG_TIME_SPEED, 'time');
        nowSpeed = CFG_TIME_SPEED[sectionIdx].speed;
        angleIncrement = nowSpeed * Global.meterPerAngle * timeInterval;

        // console.log(nowSpeed);
        // console.log(angleIncrement);
        this.surface.angle += angleIncrement;
        this.prospect.angle += angleIncrement * CGame.P_ROTATE_MULTIPLE;
        

        Global.nowSpeed = nowSpeed;
        Global.speedRatio = nowSpeed / Global.initSpeed;
        Global.distance += (angleIncrement / Global.meterPerAngle);
    }

    /**
     * 创建复活倒计时弹窗弹窗
     */
    createReviveCD = () => {
        this.reviveCD = cc.instantiate(this.reviveCDPF);
        this.node.addChild(this.reviveCD);
    }

    /**
     * 创建广告弹窗
     */
    createAds = () => {
        const node = cc.instantiate(Global.adsPF);
        
        node.getComponent('Ads').init(() => {
            this.createPlayer();
            Global.emitter.dispatch(EMsg.PLAYER_REVIVE);
            this.resumeGame();
        });

        this.node.addChild(node);
    }

    /**重置数据 */
    resetData = () => {
        this.surface = null;
        this.prospect = null;

        this.playerPF = null;
        this.enemyPF = null;
        this.reviveCDPF = null;
        this.bananaPF = null;
        this.banana_peelPF = null;
        this.diamondPF = null;
        this.goldPF = null;
        this.pepperPF = null;
        this.shitPF = null;
        this.trapPF = null;
        this.player = null;
        this.enemyPF = null;

        this.player = null;
        this.reviveCD = null;
    }
}


// ============================ 方法定义


// ============================ 立即执行

