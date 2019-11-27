// ============================ 导入


// ============================ 常量定义
const {ccclass, property} = cc._decorator;


// ============================ 变量定义
let count = 0;

// ============================ 类定义
@ccclass
export default class NewClass extends cc.Component {

    isDestory: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {
        
    // }

    start () {
        count++;
        this.isDestory = false;
        this.bubbleAnim();
    }

    onDestroy () {
        count--;
        this.isDestory = true;
    }

    // update (dt) {}
    bubbleAnim () {
        const smallBubbleNode = this.node.getChildByName('icon_smallBubble');
        const bigBubbleNode = this.node.getChildByName('icon_bigBubble');

        let timer = null;
        let fun = () => {
            timer && clearTimeout(timer);

            if (!this.isDestory) {
                cc.tween(smallBubbleNode)
                    .to(1, { opacity: 255 })
                    .call(() => {
                        cc.tween(bigBubbleNode)
                            .to(1, { opacity: 255})
                            .delay(1)
                            .to(1, { opacity: 0 })
                            .start()
                    })
                    .delay(1)
                    .to(1, { opacity: 0 })
                    .start();

                timer = setTimeout(fun, 5000);
            } else {
                timer && clearTimeout();
                timer = null;
                fun = null;
            }
        };

        setTimeout(() => {
            fun();
        }, 1000 * count);
    }
}


// ============================ 组件定义


// ============================ 方法定义


// ============================ 导出


// ============================ 立即执行

