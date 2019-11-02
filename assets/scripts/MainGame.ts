import { Utils } from "./Utils";
import { EBaseSetting } from "./Enum";

// ============================ 导入


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

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
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
        this.isPaused = false;

        this.nodeRotateBy(this.surface, EBaseSetting.ROTATE_DURATION_S, -360);
        this.nodeRotateBy(this.prospect, EBaseSetting.ROTATE_DURATION_P, -360);
    }

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

