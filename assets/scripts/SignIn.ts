import { ESceneName } from "./Enum";

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
        cc.director.preloadScene(ESceneName.MAIN_GAME, () => {
            cc.director.loadScene(ESceneName.MAIN_GAME);
        });
    }

    // update (dt) {}
}
