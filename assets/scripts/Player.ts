/**
 * @module 玩家
 */
// ============================ 导入
import { CGame, EMsg, ETProp } from "./mod/enum";
import { Global } from "./mod/global";
import Prop from "./Prop";

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
    /**骨骼 */
    private _selfSkeleton: sp.Skeleton;
    /**当前相对于水平面的角度 */
    relativeAngle: number;
    /**主游戏上下文 */
    mainGame: any = null;
    /**类型 */
    selfType: string = 'player';
    /**是否死亡 */
    isDead: boolean = false;
    /**初始角度 */
    initAngle: number = 0;
    /**磁铁生效 */
    isMagnetic: boolean = false;
    /**磁铁持续时间 */
    // magneticDuration: number = 0;
    // 护盾持续时间
    // shieldDuration: number = 0;
    /**吸引的道具 */
    attractProps: any[] = [];
    /**护盾生效 */
    isShield: boolean = false;


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
    // LIFE-CYCLE CALLBACKS
    onLoad () {
        this.init();
    }

    // start () {
        
    // }

    update (timeInterval: number) {
        this.handleMagetic(timeInterval);
        this.handleShield(timeInterval);
    }

    onDestroy() {
        Global.emitter.remove(EMsg.SPEED_CHANGE, this.setTimeScale);
    }
    // LIFE-CYCLE CALLBACKS

    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        const oComponent = other.getComponent('Prop') || 
                           other.getComponent('Enemy') || 
                           other.getComponent('Obstacle');

        if (oComponent === null || this.isDead) return;

        switch (oComponent.selfType) {
            case ETProp.BANANA:
                this.enemyMoveBack();
                break;
            case ETProp.SHIT:
                this.enemyMoveBack();
                break;
            case ETProp.MAGNET:
                this.adsorbProp();
                break;
            case ETProp.TRAP:
                this.enemyMoveForward();
                break;
            case ETProp.PEPPER:
                this.addShield();
                break;
            case ETProp.DIAMOND:
                this.getScore();
                break;
            case 'enemy':
                this.ownDead();
                break;
        }

        
    }

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
        this.moveProps();
        return cc.moveBy(this._jumpDuration, cc.v2(0, this._jumpHeight)).easing(cc.easeCubicActionOut());
    }

    /**
     * @method 下落
     */
    jumpDown = () => {
        this.moveProps();
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
        if (Global.shieldDuration > 0) return;

        (Global.mainGame.enemy as cc.Node).getComponent('Enemy').roleMove(-Global.meterPerAngle*25);
    }
    
    /**
     * 吸附道具
     */
    adsorbProp = () => {
        if (this.isDead) return;

        Global.magneticDuration += CGame.MAGNETIC_DURATOIN;
    }

    /**
     * 添加护盾
     */
    addShield = () => {
        if (this.isDead) return;

        Global.shieldDuration += CGame.SHIELD_DURATION;
    }

    /**
     * 获取分数
     */
    getScore = () => {
        Global.score += CGame.DIAMOND_SCORE;
        Global.mainGame.modifyScore();
    }

    /**
     * 自己死亡
     */
    ownDead = () => {
        
        this.isDead = true;
        this.isMagnetic = false;
        this._selfSkeleton.setAnimation(0, 'death', false);
    }

    /**
     * 设置时间缩放
     */
    setTimeScale = (scale: number = 1) => {
        this._selfSkeleton.timeScale = Global.speedRatio;
    }

    /**
     * 处理磁性时间
     */
    handleMagetic = (timeInterval: number) => {
        Global.magneticDuration -= (timeInterval*1000);
        Global.magneticDuration = Global.magneticDuration < 0 ? 0 : Global.magneticDuration;
        
        if (this.isDead) {
            this.clearProps();
            return;
        }

        const keys = Object.keys(Global.createProps);

        if (Global.magneticDuration > 0 && keys.length) {
            for (let i = 0; i < keys.length; i++) {
                const prop:Prop = Global.createProps[keys[i]];
    
                if (prop.selfType !== ETProp.TRAP) {
                    this.attractProps.push(prop);
                }
                
                delete Global.createProps[keys[i]];
                keys.splice(i, 1);
                i--;
            }
        }

        this.moveProps();
    }

    handleShield = (dt: number) => {
        if (Global.shieldDuration <= 0) return;

        Global.shieldDuration -= (dt*1000);
        Global.shieldDuration = Global.shieldDuration < 0 ? 0 : Global.shieldDuration;
    }

    /**移动道具 */
    moveProps = () => {
        if (!this.attractProps.length) return;
        
        for (let i = 0; i < this.attractProps.length; i++) {
            const prop: Prop = this.attractProps[i];

            if (prop.isDestory) {
                this.attractProps.splice(i, 1);
                i--;
            } else {
                prop.actMoveTo(this.node.x, this.node.y);
            }

        }
    }

    clearProps = () => {
        if (!this.attractProps.length) return;

        this.attractProps.forEach((prop: Prop) => {
            if (!prop.isDestory) {
                prop.node.destroy();
            }
        });

        this.attractProps = [];
    }

    /**
     * 重置数据
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

