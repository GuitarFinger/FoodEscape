
/**
 * @module 通用常量
 */

/**
 * @desc 场景名称
 */
export enum ESceneName {
    /**加载 */
    LOADING = "loading",

    /**主菜单 */
    MAIN_MENU = "main_menu",

    /**主游戏 */
    MAIN_GAME = "main_game",
    
    /**主场景 */
    MAIN = "main",
   
    /**结算 */
    ACCOUNT = "account",
    
    /**排行 */
    RANK = "rank"
}

/**
 * @desc 游戏常量
 */
export class Constants {
    /**中景转动倍率 */
    static P_ROTATE_MULTIPLE = 1/4;
    
    /**地表转动360度的时间 */
    static ROTATE_DURATION_S = 10;
    
    /**中景转动360度的时间 */
    static ROTATE_DURATION_P = 40;
    
    /**连跳次数 */
    static JUMP_COUNT = 2;
    
    /**初始距离 */
    static INIT_DISTANCE = 100;
    
    /**最大距离 */
    static MAX_DISTANCE = 120;
    // ======================= 生成物体
    /**主游戏场景扇形角 */
    static SECTOR_ANGLE = 60;

    /**主游戏场景扇形角与水平面夹角(PS: 这个扇形角小于180°) [(180-Constants.SECTOR_ANGLE) / 2] */
    static SECTOR_LEVLE_ANGLE = 60;

    /**第一半径 */
    static FIRST_RADIUS = 687;
    /**第二半径 */
    static SECOND_RADIUS = 950;
    /**第三半径 */
    static THIRD_RADIUS = 1150;
}