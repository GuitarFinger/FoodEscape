/**
 * @module 游戏主逻辑
 */
// ============================ 导入
import { Utils } from "./Utils";
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
        this.createPlayer();
        this.createEnemey();
        this.createProp();
        // this.createObstacle();

        this.schedule(this.createProp, 2);
        this.schedule(this.createObstacle, 4);

        this.bindListener();

        Global.initSpeed = CFG_TIME_SPEED[0].speed;
        Global.speedRatio = 1; 
        Global.meterPerAngle = this.calcMeterPerAngle(
            this.calcRelativeSurfaceAngle(this.player, 'Player'),
            this.calcRelativeSurfaceAngle(this.enemy, 'Enemy')
        );

    }

    start () {
        this.startGame();
    }

    update (dt) {
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
        return Math.abs(Math.abs(angle1) - Math.abs(angle2)) / Constants.INIT_DISTANCE;
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
        // TODO 这里应该用缓冲池
        const prop: cc.Node = cc.instantiate(this.propFab);

        const ownAngle = Utils.convertAngle(Constants.SECTOR_LEVLE_ANGLE- this.surface.angle);
        const x = Math.cos(ownAngle * Math.PI / 180) * Constants.SECOND_RADIUS;
        const y = Math.sin(ownAngle * Math.PI / 180) * Constants.SECOND_RADIUS;

        // surface的中心点就在中间 而且原点与圆点与中心点重合故可以这样计算坐标
        prop.getComponent('Prop').init(x, y, ownAngle, 'coin');

        this.surface.addChild(prop);
    }

    /**
     * 创建障碍物
     */
    createObstacle = () => {
        // TODO 这里应该用缓冲池
        const obstacle: cc.Node = cc.instantiate(this.obstacleFab);

        const ownAngle = Utils.convertAngle(Constants.SECTOR_LEVLE_ANGLE-this.surface.angle);
        const x = Math.cos(ownAngle * Math.PI / 180) * Constants.FIRST_RADIUS;
        const y = Math.sin(ownAngle * Math.PI / 180) * Constants.FIRST_RADIUS;

        // surface的中心点就在中间 而且原点与圆点与中心点重合故可以这样计算坐标
        obstacle.getComponent('Obstacle').init(x, y, ownAngle, 'obstacle');

        this.surface.addChild(obstacle);
    }

    /**
     * 更新转动
     */
    updateRotate = () => {
        let nowTime: number, timeInterval: number, timeLength: number, sectionIdx: number, nowSpeed: number;

        nowTime = Date.now();
        timeInterval = (nowTime-this.lastRotateTime) / 1000;
        timeLength = (nowTime-this.startRotateTime) / 1000;
        sectionIdx = Utils.judgeSection(timeLength, CFG_TIME_SPEED, 'time');
        nowSpeed = CFG_TIME_SPEED[sectionIdx].speed;

        this.surface.angle += nowSpeed * timeInterval;
        this.prospect.angle += nowSpeed * timeInterval * Constants.P_ROTATE_MULTIPLE;
        this.lastRotateTime = nowTime;

        Global.speedRatio = nowSpeed / Global.initSpeed;
    }
}


// ============================ 方法定义


// ============================ 立即执行

