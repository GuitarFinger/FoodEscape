import { Global } from "./mod/global";
import { Utils } from "./mod/utils";
import { TProp, CGame, ETProp } from "./mod/enum";

/**
 * @module 道具
 */
// ============================ 导入

// ============================ 类型定义


// ============================ 常量定义
const {ccclass, property} = cc._decorator;


// ============================ 变量定义


// ============================ 类定义
@ccclass
export default class Prop extends cc.Component {
    /**道具类型 */
    selfType: TProp = null;
    /**初始X */
    initX: number = 0;
    /**初始Y */
    initY: number = 0;
    /**初始角度 */
    initAngle: number = 0;
    /**池节点 */
    poolNode: cc.Node;
    /**图片路径 */
    imgSprite: cc.SpriteFrame;
    /**移动时间 */
    moveToTime: number = 100;
    /**是否销毁 */
    isDestory: boolean = false;
    /**上一次移动时间 */
    lastMoveTime: number = 0;

    /**
     * 初始化
     */
    init = (x: number, y: number, angle: number, selfType: TProp) => {
        this.initX = x;
        this.initY = y;
        this.initAngle = Utils.getRotateAngle(angle);
        this.selfType = selfType || ETProp.GOLD;        
    }

    // LIFE-CYCLE CALLBACKS

    onLoad () {
        this.isDestory = false;
        this.node.setPosition(cc.v2(this.initX, this.initY));
        this.node.angle = this.initAngle;
        this.getComponent(cc.Sprite).spriteFrame = Global.spriteAtlasMap.get('ui_props').getSpriteFrame(this.selfType);
        this.node.opacity = 255;
    }

    // start () {

    // }

    // update (dt) {}

    onDestroy () {
        this.isDestory = true;
        this.node.stopAllActions();
    }
    // LIFE-CYCLE CALLBACKS

    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        const oComponent = other.getComponent('Enemy') || other.getComponent('Prop')

        if (oComponent) return;

        this.node.destroy();
        this.isDestory = true;
    }

    actMoveTo (x: number, y: number) {
        if (this.isDestory) return;
        
        let nowTime: number, timeDif: number;

        nowTime = Date.now();
        timeDif = (nowTime - (this.lastMoveTime || nowTime))/1000;

        const difX = Math.abs(this.node.x - x) * timeDif * CGame.PROP_ATTRACT_SPEED;
        const difY = Math.abs(this.node.y - y) * timeDif * CGame.PROP_ATTRACT_SPEED;

        this.node.x += ((this.node.x < x ? 1 : -1) * difX);
        this.node.y += ((this.node.y < y ? 1 : -1) * difY);

        this.lastMoveTime = nowTime;
    }
}


// ============================ 组件定义


// ============================ 方法定义


// ============================ 导出


// ============================ 立即执行

