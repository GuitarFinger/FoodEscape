import DB from "./mod/db";

/**加载模块 */
export class LoadModel {
    /**
     * 获取基本数据
     */
    static getBaseData = (callback?: Function) => {
        // 签到数据
        DB.data.sign = {
            index: 1,
            list: [
                0, 0, 0, 0, 0, 0, 0
            ]
        }

        // 玩家数据
        DB.data.player = {
            gold: 0,
            diamond: 0,
            build_lv: 1,
            no_collect_gold: 0,
        }

        callback && callback();
    };
}

/**
 * 游戏与后台通讯模块
 */
export class SignModel {
    public static signIn = (whichDay: number, callback?: Function) => {
        DB.data.sign.list[whichDay] = 1;
        callback && callback();
    }
}

export class MenuModel {
    public static upgradeBuild = (cost: number, callback?: Function) => {

        DB.data.player.build_lv += 1;
        DB.data.player.diamond -= cost;

        callback && callback()
    }
}