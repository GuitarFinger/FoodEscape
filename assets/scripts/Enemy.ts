/**
 * @module 敌人
 */
// ============================ 导入


// ============================ 常量定义
const {ccclass, property} = cc._decorator;


// ============================ 变量定义


// ============================ 类定义
@ccclass
export default class Enemy extends cc.Component {
    /**
     * 速度 米/秒 | 度/秒
     */
    speed: number = 3;
    /**
     * 当前相对于水平面的角度
     */
    relativeAngle: number;
    /**
     * 上一次时间
     */
    lastTime: number = 0;
    /**
     * X方向
     */
    directionX: 'left' | 'right' = 'left';
    /**
     * 主游戏上下文
     */
    mainGame: any = null;
    /**
     * 类型
     */
    selfType: string = 'enemy';
    /**
     * 是否正在手动移动
     */
    isHandMove: boolean = false;
    /**
     * 骨骼
     */
    selfSkeleton: sp.Skeleton;

    // LIFE-CYCLE CALLBACKS:

    init() {
        this.selfSkeleton = this.node.getChildByName('spine').getComponent(sp.Skeleton);
    }
    
    onLoad () {
        this.init();
    }

    start () {

    }

    update (dt) {
        // console.log(dt);
        if (this.mainGame.isPaused === true) return;
        
        if (!this.isHandMove) {
            this.move(dt);
        }
    }

    onCollisionEnter (other: cc.Node, self: cc.Node) {
        
        const oComponent = other.getComponent('Player');

        if (oComponent === null) return;

        if (oComponent.selfType === 'player') {
            this.mainGame.pauseGame();
        }

    }

    /**
     * 移动
     */
    move = (dt: number) => {
        const nowTime = Date.now();
        const meterPreAngle = this.mainGame.meterPerAngle || 0.2;
        const timeSpace = (nowTime - (this.lastTime || nowTime)) / 1000;

        const finalAngle = (this.relativeAngle + (this.directionX === 'left' ? -1 : 1) * meterPreAngle * timeSpace * this.speed) % 360;

        this.lastTime = nowTime;

        this.roleRotate(finalAngle);
    }

    /**
     * 人物旋转
     */
    roleRotate = (angle: number) => {
        const rotateToAngle = this.getRoleRotateAngle(angle);

        const nowWorldX = 375 + Math.cos(angle * Math.PI / 180) * 667;
        const nowWorldY = Math.sin(angle * Math.PI / 180) * 667;

        // 设置人物位置和旋转
        this.node.setPosition(this.mainGame.node.convertToNodeSpaceAR(cc.v2(nowWorldX, nowWorldY)));
        this.node.angle = rotateToAngle;

        this.relativeAngle = angle;
    }

    /**
     * 人物移动
     */
    roleMove = (angle: number) => {
        if (angle === 0) return;

        let finalAngle = this.relativeAngle + angle;
        let tempAngle = null;
        let timer = null;

        // 平滑过渡
        let fun = () => {
            timer && clearTimeout(timer);

            this.isHandMove = true;

            if (angle > 0 && this.relativeAngle < finalAngle) {
                tempAngle = this.relativeAngle + this.mainGame.meterPerAngle;
                tempAngle = tempAngle > finalAngle ? finalAngle : tempAngle;

                this.roleRotate(tempAngle);

                timer = setTimeout(fun, 10);
            }
            else if (angle < 0 && this.relativeAngle > finalAngle) {
                tempAngle = this.relativeAngle - this.mainGame.meterPerAngle;
                tempAngle = tempAngle < finalAngle ? finalAngle : tempAngle;

                this.roleRotate(tempAngle);

                timer = setTimeout(fun, 10);
            }
            else {
                this.isHandMove = false;
                fun = null;
            }
        }

        fun();
    }

    /**
     * 获取人物旋转角度
     */
    getRoleRotateAngle = (angle: number) => {
        angle = angle < 0 ? 360 + angle : angle;

        let roleRotateAngle = 0;

        roleRotateAngle = (Math.floor(angle / 90) - 1) * 90 + angle % 90;

        return roleRotateAngle;
    }

    /**
     * 设置时间缩放
     */
    setTimeScale = (scale: number = 1) => {
        this.selfSkeleton.timeScale = scale;
    }
}


// ============================ 组件定义


// ============================ 方法定义


// ============================ 导出


// ============================ 立即执行

