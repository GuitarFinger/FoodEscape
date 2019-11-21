/**
 * @module 玩家
 */
// ============================ 导入
import { CGame, EMsg, DTip } from "./mod/enum";
import { Global } from "./mod/global";

// ============================ 常量定义
const {ccclass, property} = cc._decorator;


// ============================ 变量定义


// ============================ 类定义
@ccclass
export default class Player extends cc.Component {
    /**跳跃高度 */
    private _jumpHeight: number = 200;
    /**跳跃持续时间 */
    private _jumpDuration: number = 0.3;
    /**速度 米/秒 | 度/秒 */
    private _speed: number = 0;
    /**地表Y坐标 */
    private _surfaceY: number = 0;
    /**是否跳起 */
    private _isJump: boolean = false;
    /**跳起次数 */
    private _jumpCount: number = 0;
    /**当前相对于水平面的角度 */
    relativeAngle: number;
    /**主游戏上下文 */
    mainGame: any = null;
    /**类型 */
    selfType: string = 'player';
    /**是否死亡 */
    isDead: boolean = false;
    /**骨骼 */
    private _selfSkeleton: sp.Skeleton;

    init = () => {
        this._surfaceY = this.node.y;
        this._selfSkeleton = this.node.getChildByName('spine').getComponent(sp.Skeleton);
        this._selfSkeleton.setCompleteListener((trackEntry) => {
            if (trackEntry.animation.name === 'death') {
                this.node.destroy();
            }
        });

        Global.emitter.register({
            [EMsg.SPEED_CHANGE]: this.setTimeScale
        });
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.init();
    }

    // start () {
        
    // }

    onDestroy() {
        Global.emitter.remove(EMsg.SPEED_CHANGE, this.setTimeScale);
    }

    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        const oComponent = other.getComponent('Prop') || 
                           other.getComponent('Enemy') || 
                           other.getComponent('Obstacle');

        if (oComponent === null || this.isDead) return;

        switch (oComponent.selfType) {
            case 'addDist':
                Global.emitter.dispatch(EMsg.SCREEN_TIPS, new DTip((Global.mainGame.node as cc.Node), `collison ${oComponent.selfType}`));
                this.enemyMoveBack();
                break;
            case 'magnet':
                Global.emitter.dispatch(EMsg.SCREEN_TIPS, new DTip((Global.mainGame.node as cc.Node), `collison ${oComponent.selfType}`))
                this.adsorbProp();
                break;
            case 'obstacle':
                Global.emitter.dispatch(EMsg.SCREEN_TIPS, new DTip((Global.mainGame.node as cc.Node), `collison ${oComponent.selfType}`))
                this.enemyMoveForward();
                break;
            case 'enemy':
                Global.emitter.dispatch(EMsg.SCREEN_TIPS, new DTip((Global.mainGame.node as cc.Node), `collison ${oComponent.selfType}`)) 
                this.ownDead();
                break;
        }

        
    }

    // update (dt) {}

    jump = () => {
        if (this.isDead) return;
        if (this._isJump && this._jumpCount === CGame.JUMP_COUNT) return;
        
        
        this._isJump && this.node.stopAllActions();
        
        this._isJump = true;
        this._jumpCount++;

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
        return cc.moveBy(this._jumpDuration, cc.v2(0, this._jumpHeight)).easing(cc.easeCubicActionOut());
    }

    /**
     * @method 下落
     */
    jumpDown = () => {
        return cc.moveTo(this._jumpDuration, cc.v2(this.node.x, this._surfaceY)).easing(cc.easeCubicActionIn());
    }

    /**
     * 敌人后退
     */
    enemyMoveBack = () => {
        (Global.mainGame.enemy as cc.Node).getComponent('Enemy').roleMove(Global.meterPerAngle * 25);
    }

    /**
     * 敌人前进
     */
    enemyMoveForward = () => {
        (Global.mainGame.enemy as cc.Node).getComponent('Enemy').roleMove(-Global.meterPerAngle*25);
    }
    
    /**
     * 吸附道具
     */
    adsorbProp = () => {
        
    }

    /**
     * 自己死亡
     */
    ownDead = () => {
        // this.isDead = true;
        // this._selfSkeleton.setAnimation(0, 'death', false);
    }

    /**
     * 设置时间缩放
     */
    setTimeScale = (scale: number = 1) => {
        this._selfSkeleton.timeScale = Global.speedRatio;
    }

    /**
     * @method 重置数据
     */
    resetData = () => {
        this._isJump = false;
        this._jumpCount = 0;
    }
    
}


// ============================ 组件定义


// ============================ 方法定义


// ============================ 导出


// ============================ 立即执行

