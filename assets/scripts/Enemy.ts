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

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    update (dt) {
        // console.log(dt);
        if (this.mainGame.isPaused === true) return;
        
        this.move(dt);
    }

    onCollisionEnter (other: cc.Node, self: cc.Node) {
        
        const oComponent = other.getComponent('Player');

        if (oComponent === null) return;

        if (oComponent.selfType === 'player') {
            this.mainGame.pauseGame();
        }

    }

    move = (dt: number) => {
        const nowTime = Date.now();
        this.lastTime = this.lastTime || nowTime;

        const meterPreAngle = this.mainGame.meterPerAngle || 0.2;
        const timeSpace = (nowTime - this.lastTime) / 1000;

        const nowAngle = (this.relativeAngle + (this.directionX === 'left' ? -1 : 1) * meterPreAngle * timeSpace * this.speed) % 360;
        // const roleRotate = this.getRoleRotateAngle(nowAngle);

        // const nowWorldX = 375 + Math.cos(nowAngle * Math.PI / 180) * 667;
        // const nowWorldY = Math.sin(nowAngle * Math.PI / 180) * 667;

        // // 设置人物位置和旋转
        // this.node.setPosition(this.mainGame.node.convertToNodeSpaceAR(cc.v2(nowWorldX, nowWorldY)));
        // this.node.angle = roleRotate;

        // this.relativeAngle = nowAngle;
        this.roleRotate(nowAngle);

        this.lastTime = nowTime;
    }

    /**
     * 人物旋转
     */
    roleRotate = (angle: number, isAction: boolean = false) => {
        const rotateToAngle = this.getRoleRotateAngle(angle);

        const nowWorldX = 375 + Math.cos(angle * Math.PI / 180) * 667;
        const nowWorldY = Math.sin(angle * Math.PI / 180) * 667;

        // 设置人物位置和旋转
        if (!isAction) {
            this.node.setPosition(this.mainGame.node.convertToNodeSpaceAR(cc.v2(nowWorldX, nowWorldY)));
            this.node.angle = rotateToAngle;
    
            this.relativeAngle = angle;
        } else {
            // const posAction = cc.moveTo(1, this.mainGame.node.convertToNodeSpaceAR(cc.v2(nowWorldX, nowWorldY)));
            // const rotateAction = cc.rotateTo(1, -rotateToAngle);
            // const spawnAction = cc.spawn(posAction, rotateAction);
            // this.node.runAction(spawnAction);

            this.node.setPosition(this.mainGame.node.convertToNodeSpaceAR(cc.v2(nowWorldX, nowWorldY)));
            this.node.angle = rotateToAngle;
    
            this.relativeAngle = angle;

            
        }
    }

    roleMove = (angle: number) => {
        const nowAngle = this.relativeAngle + angle;

        this.roleRotate(nowAngle, true);
    }

    getRoleRotateAngle = (angle: number) => {
        angle = angle < 0 ? 360 + angle : angle;

        let roleRotateAngle = 0;

        roleRotateAngle = (Math.floor(angle / 90) - 1) * 90 + angle % 90;

        return roleRotateAngle;
    }
}


// ============================ 组件定义


// ============================ 方法定义


// ============================ 导出


// ============================ 立即执行

