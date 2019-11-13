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
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    /**
     * 初始化
     */
    init = (initData: { x: number, y: number, angle: number }) => {
        this.node.x = initData.x;
        this.node.y = initData.y;
        this.node.angle = initData.angle;
    }
}


// ============================ 组件定义


// ============================ 方法定义


// ============================ 导出


// ============================ 立即执行

