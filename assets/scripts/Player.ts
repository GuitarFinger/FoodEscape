/**
 * @module 玩家
 */
// ============================ 导入
import { EBaseSetting } from "./Enum";

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
    /**
     * 骨骼
     */
    selfSkeleton: sp.Skeleton;

    init = () => {
        this.surfaceY = this.node.y;
        this.selfSkeleton = this.node.getChildByName('spine').getComponent(sp.Skeleton);
        this.selfSkeleton.setCompleteListener((trackEntry) => {
            if (trackEntry.animation.name === 'death') {
                this.node.destroy();
            }
        });
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.init();
    }

    start () {
        
    }

    onCollisionEnter (other: cc.Node, self: cc.Node) {
        console.log("oh  is collision");

        const oComponent = other.getComponent('Prop') || other.getComponent('Enemy') || other.getComponent('Obstacle');

        if (oComponent === null || this.isDead) return;

        switch (oComponent.selfType) {
            case 'coin':
                oComponent.node.destroy();
                this.collisonProp();
                break;

            case 'diamond': 
                oComponent.node.destroy();
                this.collisonProp();
                break;

            case 'obstacle': 
                this.collsionObstacle();
                break;
            
            case 'enemy': 
                this.collsionEnemy();
                break;
        }

        
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
     * 碰撞道具
     */
    collisonProp = () => {
        const enemy = (this.mainGame.enemy as cc.Node).getComponent('Enemy');
        const meterPerAngle = this.mainGame.meterPerAngle;

        enemy.roleMove(meterPerAngle * 25);
    }

    /**
     * 碰撞障碍
     */
    collsionObstacle = () => {
        const enemy = (this.mainGame.enemy as cc.Node).getComponent('Enemy');
        const meterPerAngle = this.mainGame.meterPerAngle;

        enemy.roleMove(-meterPerAngle * 25);
    }
    
    /**
     * 碰撞敌人
     */
    collsionEnemy = () => {
        // const spineNode = this.node.getChildByName('spine');
        // const skeleton = spineNode.getComponent(sp.Skeleton);

        this.isDead = true;
        this.selfSkeleton.setAnimation(0, 'death', false);
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

