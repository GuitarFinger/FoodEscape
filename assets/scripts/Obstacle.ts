import { Utils } from "./Utils";

/**
 * @module 障碍物
 */
// ============================ 导入


// ============================ 类型定义
type TObstacle = 'obstacle';

// ============================ 常量定义
const {ccclass, property} = cc._decorator;


// ============================ 变量定义


// ============================ 类定义
@ccclass
export default class Obstacle extends cc.Component {
    @property
    selfType: 'obstacle' = 'obstacle';
    /**初始X */
    initX: number = 0;
    /**初始Y */
    initY: number = 0;
    /**初始角度 */
    initAngle: number = 0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        setTimeout(() => {
            this.node.setPosition(cc.v2(this.initX, this.initY));
            this.node.angle = Utils.getRotateAngle(this.initAngle);
            this.node.opacity = 255;
        }, 1);
    }

    // update (dt) {}

    /**
     * 初始化
     */
    init = (x: number, y: number, angle: number, selfType: TObstacle ) => {
        this.initX = x;
        this.initY = y;
        this.initAngle = angle;
        this.selfType = selfType;
    }

    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        this.node.destroy();
    }
}


// ============================ 组件定义


// ============================ 方法定义


// ============================ 导出


// ============================ 立即执行

