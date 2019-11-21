// ============================ 导入
import { ESceneName, EMsg, DTip } from "./mod/enum";
import DB from "./mod/db";
import { Global } from "./mod/global";
import { Utils } from "./mod/utils";

// ============================ 常量定义
const {ccclass, property} = cc._decorator;


// ============================ 变量定义


// ============================ 类定义
@ccclass
export default class Sign extends cc.Component {
    @property({ type: cc.Prefab, displayName: '签到项预制体' })
    signItemPreFab: cc.Prefab = null;

    // =====LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.bindListener();
        this.init();
    }

    start () {
        
    }

    // update (dt) {}
    // =====LIFE-CYCLE CALLBACKS:

    init = () => {
        this.createSignList();
    }
    /**
     * 绑定监听
     */
    bindListener = () => {
        const bgOpacity = this.node.getChildByName('bg_opacity');
        const boxSign = this.node.getChildByName('box_sign');
        const btnClose = boxSign.getChildByName('btn_close');


        bgOpacity.on(cc.Node.EventType.TOUCH_START, this.closePage);
        boxSign.on(cc.Node.EventType.TOUCH_START, () => {});
        btnClose.on(cc.Node.EventType.TOUCH_START, this.closePage);
    }

    /**
     * 关闭页面
     */
    closePage = () => {
        this.node.destroy();
    }

    /**
     * 创建签到列表
     */
    createSignList = () => {
        const signIdx:number = DB.data.sign.index;
        const dbSignList: number[] = DB.data.sign.list;
        const signLength = dbSignList.length;
        const boxSign = this.node.getChildByName('box_sign');
        const boxSignLayout = boxSign.getChildByName('box_signLayout')
        const boxSignLast = boxSign.getChildByName('box_signLast');

        dbSignList.forEach((val: number, idx: number) => {
            if (idx < signLength-1) {
                const item = cc.instantiate(this.signItemPreFab);
                
                this.initSignItem(item, idx, !!val);

                item.on(cc.Node.EventType.TOUCH_START, () => {
                    this.handleSignIn(idx, item);
                });

                boxSignLayout.addChild(item);
                
            }
        });

        this.initSignItem(boxSignLast, signLength-1, !!dbSignList[signLength-1], true);

        boxSignLast.on(cc.Node.EventType.TOUCH_START, () => {
            this.handleSignIn(signLength-1, boxSignLast, true);
        });
    }

    /**
     * 初始化签到项
     */
    initSignItem = (item: cc.Node, index: number, isSigned: boolean, isLast = false) => {
        Utils.modifyImageFromAltas(item.getChildByName('bg_sign'), 'ui_sign', `bg_sign_${isSigned ? 'gray': 'normal'}`);
        Utils.modifyImageFromAltas(item.getChildByName('icon_shadow'), 'ui_sign', `icon_shadow_${isSigned ? 'gray': 'normal'}`);
        Utils.modifyImageFromAltas(item.getChildByName('icon_diamond'), 'ui_sign', `icon_diamond${isLast ? 's': ''}_${isSigned ? 'gray': 'normal'}`);
        
        item.getChildByName('icon_dui').active = isSigned ? true : false;
        item.getChildByName('text_title').getComponent(cc.RichText).string = `<color=#5F371D><b>第${index+1}天</b></c>`;
        item.getChildByName('text_diamondNum').getComponent(cc.RichText).string = `<color=#6A3F23><b>X${index * 10}</b></c>`;
    }

    /**
     * 
     */
    handleSignIn = (whichDay: number, item: cc.Node, isLast = false) => {
        const dbSignList: number[] = DB.data.sign.list;
        const dbSignIdx: number = DB.data.sign.index;


        if (whichDay > dbSignIdx) {
            Global.emitter.dispatch(EMsg.SCREEN_TIPS, new DTip(this.node, `isn't reach to ${whichDay} day`));
            console.log(`isn't reach to ${whichDay} day`);
            return;
        }
        
        if (dbSignList[whichDay] !== 0) {
            Global.emitter.dispatch(EMsg.SCREEN_TIPS, new DTip(this.node, `${whichDay} day is signed`));
            console.log(`${whichDay} day is signed`);
            return;
        }

        SignModel.signIn(whichDay, () => {
            this.initSignItem(item, whichDay, true, isLast);
        });
        
    }
}


class SignModel {
    public static signIn = (whichDay: number, callback?: Function) => {

        DB.data.sign.list[whichDay] = 1;
        callback && callback();
    }
}

// ============================ 组件定义


// ============================ 方法定义


// ============================ 导出


// ============================ 立即执行


