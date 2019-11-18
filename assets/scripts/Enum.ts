
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
 * @desc 道具类型
 */
export enum EPropType {
    /**添加距离 */
    ADD_DIST = 'addDist',
    /**磁铁 */
    MAGNET = 'magnet',
    /**钻石 */
    DIAMOND = 'diamond',
}

export type TProp = 'coin' | 'diamond' | 'magnet' | 'addDist';
export type TPoint = { x: number, y: number };
export type TDuadrant = 0 | 1 | 2 | 3 | 4;

/**
 * @desc 游戏常量
 */
export class Constants {
    /**中景转动倍率 */
    static P_ROTATE_MULTIPLE = 1/4;
    
    /**连跳次数 */
    static JUMP_COUNT = 2;
    
    /**初始距离 */
    static INIT_DISTANCE = 100;
    
    /**敌人和玩家之间的最大距离 ENEMY_PLAYER_DISTANCE */
    static E_P_MAX_DISTANCE = 120;
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

    /**添加距离道具的间隔*/
    static ADDDIST_GAP_RANGE = 100;
    /**钻石的间隔 */
    static DIAMOND_GAP_RANGE = 50;
    /**障碍物间隔 */
    static OBSTACLE_GAP_RANGE = 300;

    /**时间间隔范围 */
    static TIME_GAP_RANGE = 5;

    /**生成钻石的概率 */
    static DIAMOND_ODDS = 0.5;

}