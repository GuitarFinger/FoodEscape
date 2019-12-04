/**
 * @module 敌人
 */
// ============================ 导入
import { Global } from "./mod/global";
import { Utils } from "./mod/utils";
import { CGame, EMsg } from "./mod/enum";

// ============================ 常量定义
const {ccclass, property} = cc._decorator;


// ============================ 变量定义


// ============================ 类定义
@ccclass
export default class Enemy extends cc.Component {
    /**速度 米/秒 | 度/秒 */
    speed: number = 3;
    /**当前相对于水平面的角度 */
    relativeAngle: number;
    /**初始角度 */
    initAngle: number;
    /**上一次时间 */
    private _lastTime: number = 0;
    /**X方向 */
    private _directionX: 'left' | 'right' = 'left';
    /**是否正在手动移动 */
    private _isHandMove: boolean = false;
    /**骨骼 */
    private _selfSkeleton: sp.Skeleton;
    /**类型 */
    selfType: string = 'enemy';

    // LIFE-CYCLE CALLBACKS:

    init() {
        this._selfSkeleton = this.node.getChildByName('spine').getComponent(sp.Skeleton);

        Global.emitter.register({
            [EMsg.SPEED_CHANGE]: this.setTimeScale,
            [EMsg.PLAYER_REVIVE]: this.resetToInitPos
        });
    }
    
    onLoad () {
        this.init();
    }

    // start () {
        // this.initAngle = this.relativeAngle;
    // }

    update (timeInterval: number) {
        // console.log(dt);
        if (Global.mainGame.isPaused === true) return;
        
        if (!this._isHandMove) {
            this.move(timeInterval);
        }
    }

    onDestroy () {
        Global.emitter.remove(EMsg.SPEED_CHANGE, this.setTimeScale);
        Global.emitter.remove(EMsg.PLAYER_REVIVE, this.resetToInitPos);
    }

    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        
        const oComponent = other.getComponent('Player');

        if (oComponent === null) return;

        if (oComponent.selfType === 'player') {
            // 暂停游戏
            Global.mainGame.pauseGame();
            // 创建倒计时窗口
            Global.mainGame.createReviveCD();
        }

    }

    /**
     * 移动
     */
    move = (timeInterval: number) => {
        // const nowTime = Date.now();
        const meterPreAngle = Global.meterPerAngle || 0.2;
        // const timeSpace = (nowTime - (this._lastTime || nowTime)) / 1000;

        const finalAngle = (this.relativeAngle + (this._directionX === 'left' ? -1 : 1) * meterPreAngle * timeInterval * this.speed) % 360;

        this._lastTime += (timeInterval * 1000);

        this.roleRotate(finalAngle);
    }

    /**
     * 人物旋转
     */
    roleRotate = (angle: number) => {
        const rotateToAngle = Utils.getRotateAngle(angle);

        const nowWorldX = 375 + Math.cos(angle * Math.PI / 180) * 667;
        const nowWorldY = Math.sin(angle * Math.PI / 180) * 667;

        // 设置人物位置和旋转
        this.node.setPosition(Global.mainGame.node.convertToNodeSpaceAR(cc.v2(nowWorldX, nowWorldY)));
        this.node.angle = rotateToAngle;

        this.relativeAngle = angle;
    }

    /**
     * 人物移动
     */
    roleMove = (angle: number, callback?: Function) => {
        if (angle === 0 || Global.mainGame.isPaused) return;

        let finalAngle = this.relativeAngle + angle;
        let tempAngle = null;
        let timer = null;
        let maxAngleGap = CGame.E_P_MAX_DISTANCE* Global.meterPerAngle;

        // 平滑过渡
        let fun = () => {
            timer && clearTimeout(timer);

            let gameIsPause = Global.mainGame.isPaused;
            if (gameIsPause) {
                this._isHandMove = false;
                fun = null;
                callback && callback();
                return;
            }

            this._isHandMove = true;
            let angleGap = Math.abs(Math.abs(Global.mainGame.player.angle) - Math.abs(this.node.angle));
        
            if (angle > 0 && this.relativeAngle < finalAngle && angleGap < maxAngleGap) {
                tempAngle = this.relativeAngle + Global.meterPerAngle;
                tempAngle = tempAngle > finalAngle ? finalAngle : tempAngle;

                this.roleRotate(tempAngle);

                timer = setTimeout(fun, 1);
            }
            else if (angle < 0 && this.relativeAngle > finalAngle && angleGap < maxAngleGap) {
                tempAngle = this.relativeAngle - Global.meterPerAngle;
                tempAngle = tempAngle < finalAngle ? finalAngle : tempAngle;

                this.roleRotate(tempAngle);

                timer = setTimeout(fun, 1);
            }
            else {
                this._isHandMove = false;
                callback && callback();
                callback = null;
                fun = null;
            }
        }

        fun();
    }

    /**重置到初始位置 */
    resetToInitPos = () => {
        this.roleRotate(this.initAngle);
    }

    /**
     * 设置时间缩放
     */
    setTimeScale = (scale: number = 1) => {
        this._selfSkeleton.timeScale = Global.speedRatio;
        this.speed *= Global.speedRatio;
    }    
}


// ============================ 组件定义


// ============================ 方法定义


// ============================ 导出


// ============================ 立即执行

