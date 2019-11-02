import { EBaseSetting } from "./Enum";

// ============================ 导入


// ============================ 常量定义
const {ccclass, property} = cc._decorator;


// ============================ 变量定义


// ============================ 类定义
@ccclass
export default class Player extends cc.Component {
    /**
     * 跳跃高度
     */
    jumpHeight: number = 200;
    /**
     * 跳跃持续时间
     */
    jumpDuration: number = 0.3;
    /**
     * 速度 米/秒 | 度/秒
     */
    speed: number = 0;
    /**
     * 地表Y坐标
     */
    surfaceY: number = 0;
    /**
     * 是否跳起
     */
    isJump: boolean = false;
    /**
     * 跳起次数
     */
    jumpCount: number = 0;
    /**
     * 当前相对于水平面的角度
     */
    relativeAngle: number;
    /**
     * 主游戏上下文
     */
    mainGame: any = null;
    /**
     * 类型
     */
    selfType: string = 'player';
    /**
     * 是否死亡
     */
    isDead: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.init();
    }

    start () {
        
    }

    onCollisionEnter (other: cc.Node, self: cc.Node) {
        console.log("oh  is collision");
        // if (other)
        const oComponent = other.getComponent('Prop') || other.getComponent('Enemy');

        switch (oComponent.selfType) {
            case 'coin':
                console.log('拿到一个金币');
                oComponent.node.destroy();
                break;
            case 'diamond': {
                console.log('拿到一个钻石');
                oComponent.node.destroy();
                break;
            }
        }

        
    }

    init = () => {
        this.surfaceY = this.node.y;
    }

    // update (dt) {}

    jump = () => {
        if (this.isJump && this.jumpCount === EBaseSetting.JUMP_COUNT) return;
        
        
        this.isJump && this.node.stopAllActions();
        
        this.isJump = true;
        this.jumpCount++;

        this.node.runAction(cc.sequence(
                this.jumpUp(),
                this.jumpDown(),
                cc.callFunc(this.resetData)
            )
        );        
    }
    
    /**
     * @method 跳起
     */
    jumpUp = () => {
        return cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
    }

    /**
     * @method 下落
     */
    jumpDown = () => {
        return cc.moveTo(this.jumpDuration, cc.v2(this.node.x, this.surfaceY)).easing(cc.easeCubicActionIn());
    }

    /**
     * @method 重置数据
     */
    resetData = () => {
        this.isJump = false;
        this.jumpCount = 0;
    }
    
}


// ============================ 组件定义


// ============================ 方法定义


// ============================ 导出


// ============================ 立即执行

