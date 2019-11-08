/**
 * @module 游戏主逻辑
 */
// ============================ 导入
import { Utils } from "./Utils";
import { EBaseSetting } from "./Enum";

// ============================ 常量定义
const {ccclass, property} = cc._decorator;

// ============================ 变量定义


// ============================ 类定义

@ccclass
export default class MainGame extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Node)
    player: cc.Node = null;

    @property(cc.Node)
    enemy: cc.Node = null;

    @property(cc.Node)
    surface: cc.Node = null;

    @property(cc.Node)
    prospect: cc.Node = null;

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
        cc.log("1111111111");
        this.bindListener();

        this.meterPerAngle = this.calcMeterPerAngle(
            this.calcRelativeSurfaceAngle(this.player, 'Player'),
            this.calcRelativeSurfaceAngle(this.enemy, 'Enemy')
        );

    }
    

    start () {
        this.startGame();

        this.startRTime = Date.now();
    }

    // update (dt) {
    //     const nowTime = Date.now();
    //     const timeDif = (nowTime - this.startRTime) / 1000;
    //     // const displacement = this.initSpeed * timeDif + 1/2 * this.acceleration * Math.pow(timeDif, 2);
    //     let nowV = this.initSpeed + this.acceleration * timeDif;

    //     nowV = nowV > 100 ? 200 : nowV;

    //     const displacement = (this.initSpeed + nowV) /2 * timeDif;

    //     console.log("角度变化", displacement - this.surface.angle);
    //     this.surface.angle = displacement;

    //     // console.log("当前速度", nowV);
    //     // console.log("角度变化", displacement);
    //     // console.log("当前角度", this.surface.angle);
    // }

    /**
     * 开始游戏
     */
    startGame = () => {
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
            if (this.isPaused === true) return;

            player.jump();
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
}


// ============================ 方法定义


// ============================ 立即执行

