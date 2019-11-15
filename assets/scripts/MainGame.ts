/**
 * @module 游戏主逻辑
 */
// ============================ 导入
import { Utils, Factory } from "./Utils";
import { Constants } from "./Enum";
import { CFG_TIME_SPEED } from "./config/timeSpeedCfg";
import { Global } from "./Global";

// ============================ 常量定义
const {ccclass, property} = cc._decorator;

// ============================ 变量定义


// ============================ 类定义

@ccclass
export default class MainGame extends cc.Component {
    // 界面可编辑节点
    /**地表 */
    @property(cc.Node)
    surface: cc.Node = null;
    /**中景 */
    @property(cc.Node)
    prospect: cc.Node = null;

    // 预制体
    /**玩家 */
    @property(cc.Prefab)
    playerFab: cc.Prefab = null;
    /**敌人 */
    @property(cc.Prefab)
    enemyFab: cc.Prefab = null;
    /**道具 */
    @property(cc.Prefab)
    propFab: cc.Prefab = null;
    /**障碍物 */
    @property(cc.Prefab)
    obstacleFab: cc.Prefab = null;

    /**玩家节点 */
    player: cc.Node;
    /**敌人节点 */
    enemy: cc.Node;
    /**游戏是否暂停 */
    isPaused: boolean = false;
    /**转动开始时间 */
    startRotateTime: number = 0;
    /**上次转动时间 */
    lastRotateTime: number = 0;

    // // LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.player = Factory.producePlayer(this.playerFab, this.node);
        this.enemy = Factory.produceEnemy(this.enemyFab, this.node);
        
        // this.schedule(() => {
        //     Factory.produceProp(this.propFab, this.surface);
        // }, 2);
        this.schedule(() => {
            Factory.produceObstacle(this.obstacleFab, this.surface);
        }, 4);

        this.bindListener();

        Global.mainGame = this;
        Global.initSpeed = CFG_TIME_SPEED[0].speed;
        Global.speedRatio = 1; 
        Global.meterPerAngle = Utils.divideAngle(
            this.calcRelativeSurfaceAngle(this.player, 'Player'),
            this.calcRelativeSurfaceAngle(this.enemy, 'Enemy'),
            Constants.INIT_DISTANCE
        );

    }

    start () {
        this.startGame();
    }

    update (dt) {
        if (this.isPaused) return;

        // 生产拉近距离道具
        Factory.produceAddDistProp(this.propFab, this.surface);
        // 生产其它道具
        Factory.produceOtherProp(this.propFab, this.surface);

        this.updateRotate();
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
     * 暂停游戏
     */
    pauseGame = () => {
        this.isPaused = true;

        this.surface.stopAllActions();
        this.prospect.stopAllActions();
    }

    /**
     * 绑定监听
     */
    bindListener = () => {
        const player = this.player.getComponent('Player');
        const enemy = this.enemy.getComponent('Enemy');

        player.mainGame = this;
        enemy.mainGame = this;

        this.node.on(cc.Node.EventType.TOUCH_START, () => {

            if (!this.isPaused) {
                player.jump();
            }
        });
    }

    /**
     * 计算相对于水平面角度
     */
    calcRelativeSurfaceAngle = (node: cc.Node, componentType: string) => {
        const component = node.getComponent(componentType);
        const pos = (this.node as cc.Node).convertToWorldSpaceAR(node.getPosition());
        const angle = 180 + Utils.getTowPointerAngle({ x: pos.x, y: pos.y }, { x: 375, y: 1334 });

        component.relativeAngle = angle;

        return angle;
    };
    
    /**
     * 更新转动
     */
    updateRotate = () => {
        let nowTime: number, // 当前时间
            timeInterval: number, // 时间间隔
            timeLength: number, // 时间长度
            sectionIdx: number, // 时间速度区间
            nowSpeed: number, // 当前速度
            angleIncrement: number; // 角度增量

        nowTime = Date.now();
        timeInterval = (nowTime-this.lastRotateTime) / 1000;
        timeLength = (nowTime-this.startRotateTime) / 1000;
        sectionIdx = Utils.judgeSection(timeLength, CFG_TIME_SPEED, 'time');
        nowSpeed = CFG_TIME_SPEED[sectionIdx].speed;
        angleIncrement = (nowSpeed * Global.meterPerAngle) * timeInterval;

        this.surface.angle += angleIncrement;
        this.prospect.angle += angleIncrement * Constants.P_ROTATE_MULTIPLE;
        this.lastRotateTime = nowTime;

        Global.speedRatio = nowSpeed / Global.initSpeed;
        Global.distance += (angleIncrement / Global.meterPerAngle);
    }
    
}


// ============================ 方法定义


// ============================ 立即执行

