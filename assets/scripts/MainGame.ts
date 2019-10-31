// ============================ 导入


// ============================ 常量定义
const {ccclass, property} = cc._decorator;

// ============================ 变量定义


// ============================ 类定义

@ccclass
export default class MainGame extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Node)
    player: cc.Node = null;

    @property(cc.Node)
    enemy: cc.Node = null;

    @property(cc.Node)
    surface: cc.Node = null;

    @property(cc.Node)
    prospect: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.bindListener();

        this.nodeRotateBy(this.surface, 10, -360);
        this.nodeRotateBy(this.prospect, 40, -360);
    }
    

    start () {

    }

    // update (dt) {}


    bindListener = () => {
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            this.player.getComponent('Player').jump();
        });
    }

    nodeRotateBy = (node: cc.Node, duration: number = 2, angle: number = 360) => {
        const rotateAct = cc.rotateBy(duration, angle);
        const repeatRotateBy = cc.repeatForever(cc.rotateBy(duration, angle));

        node.runAction(repeatRotateBy);
    }
}


// ============================ 方法定义


// ============================ 立即执行

