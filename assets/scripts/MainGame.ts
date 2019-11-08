/**
 * @module 游戏主逻辑
 */
// ============================ 导入
import { Utils } from "./Utils";
import { EBaseSetting } from "./Enum";

// ============================ 类型定义
type NodeType = 'player' | 'enemy' | 'prop' | 'obstacle';

// ============================ 常量定义
const {ccclass, property} = cc._decorator;

// ============================ 变量定义


// ============================ 类定义

@ccclass
export default class MainGame extends cc.Component {
    // 界面可编辑节点
    @property(cc.Node)
    surface: cc.Node = null;

    @property(cc.Node)
    prospect: cc.Node = null;

    // 预制体
    @property(cc.Prefab)
    playerFab: cc.Prefab = null;

    @property(cc.Prefab)
    enemyFab: cc.Prefab = null;

    @property(cc.Prefab)
    propFab: cc.Prefab = null;

    @property(cc.Prefab)
    obstacleFab: cc.Prefab = null;

    /**
     * 玩家节点
     */
    player: cc.Node;
    /**
     * 敌人节点
     */
    enemy: cc.Node;
    /**
     * 道具
     */
    propPool: cc.NodePool = new cc.NodePool();
    /**
     * 障碍
     */
    obstaclePool: cc.NodePool = new cc.NodePool();

    /**
     * 米/度
     */
    meterPerAngle: number;
    /**
     * 游戏暂停
     */
    isPaused: boolean = false;
    /**
     * 初始速度
     */
    initSpeed: number = 40;
    /**
     * 加速度
     */
    acceleration: number = 2;
    /**
     * 转动开始时间
     */
    startRTime: number = 0;

    // // LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.createPlayer();
        this.createEnemey();
        this.createProp();
        this.createObstacle();

        this.bindListener();

        this.meterPerAngle = this.calcMeterPerAngle(
            this.calcRelativeSurfaceAngle(this.player, 'Player'),
            this.calcRelativeSurfaceAngle(this.enemy, 'Enemy')
        );

    }

    start () {
        this.startGame();
    }

    // update (dt) {}

    /**
     * 开始游戏
     */
    startGame = () => {
        this.startRTime = Date.now();
        this.isPaused = false;

        this.nodeRotateBy(this.surface, EBaseSetting.ROTATE_DURATION_S, -360);
        this.nodeRotateBy(this.prospect, EBaseSetting.ROTATE_DURATION_P, -360);    
    }

    // async test () {
    //     const a = await this.testAsync();
    //     console.log(a);
    // }

    // async testAsync(): Promise<string> {
    //     return new Promise<string>((resolve, reject) => {
    //         setTimeout(() => {
    //             resolve("hello world");
    //         }, 2000)
    //     });
    // }
    

    /**
     * 暂停游戏
     */
    pauseGame = () => {
        this.isPaused = true;

        this.surface.stopAllActions();
        this.prospect.stopAllActions();
    }

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
     * 节点旋转
     */
    nodeRotateBy = (node: cc.Node, duration: number = 2, angle: number = 360) => {
        const repeatRotateBy = cc.repeatForever(cc.rotateBy(duration, angle));

        node.runAction(repeatRotateBy);
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
     * 获取 米/度
     */
    calcMeterPerAngle = (angle1: number, angle2: number): number => {
        return Math.abs(Math.abs(angle1) - Math.abs(angle2)) / EBaseSetting.INIT_DISTANCE;
    }

    /**
     * 生成玩家
     */
    createPlayer = () => {
        this.player = cc.instantiate(this.playerFab);
        this.node.addChild(this.player);
    }

    /**
     * 生成敌人
     */
    createEnemey = () => {
        this.enemy = cc.instantiate(this.enemyFab);
        this.node.addChild(this.enemy);
    }

    /**
     * 创建道具
     */
    createProp = () => {
        let prop: cc.Node = null;

        if (this.propPool.size() > 0) {
            prop = this.propPool.get();
        } else {
            prop = cc.instantiate(this.propFab);
            this.propPool.put(prop);
        }

        this.surface.addChild(prop);
    }

    /**
     * 创建障碍物
     */
    createObstacle = () => {
        let obstacle: cc.Node = null;

        if (this.obstaclePool.size() > 0) {
            obstacle = this.obstaclePool.get();
        } else {
            obstacle = cc.instantiate(this.obstacleFab);
            this.obstaclePool.put(obstacle);
        }

        this.surface.addChild(obstacle);
    }
}


// ============================ 方法定义


// ============================ 立即执行

