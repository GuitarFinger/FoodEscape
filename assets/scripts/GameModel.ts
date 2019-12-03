import DB from "./mod/db";

/**
 * 游戏与后台通讯模块
 */
export class SignModel {
    public static signIn = (whichDay: number, callback?: Function) => {
        DB.data.sign.list[whichDay] = 1;
        callback && callback();
    }
}