import { ESceneName } from "./Enum_e";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SignIn extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    getDoubleSignAward () {
        cc.director.preloadScene(ESceneName.ACCOUNT, () => {
            cc.director.loadScene(ESceneName.ACCOUNT);
        });
    }

    // update (dt) {}
}
