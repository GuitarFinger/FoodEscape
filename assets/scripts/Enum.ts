
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
 * @desc 基本设置
 */
export enum EBaseSetting {
    /**中景转动倍率 */
    P_ROTATE_MULTIPLE = 4,
    
    /**地表转动360度的时间 */
    ROTATE_DURATION_S = 10,
    
    /**中景转动360度的时间 */
    ROTATE_DURATION_P = 40,
    
    /**连跳次数 */
    JUMP_COUNT = 2,
    
    /**初始距离 */
    INIT_DISTANCE = 100,
    
    /**最大距离 */
    MAX_DISTANCE = 120,
    
    /**主游戏场景扇形角 */
    SECTOR_ANGLE = 120,

    /**主游戏场景扇形角与水平面夹角(PS: 这个扇形角小于180°) [(180-EBaseSetting.SECTOR_ANGLE) / 2] */
    SECTOR_LEVLE_ANGLE = 30,

    /**道具最小半径 */
    PROP_RADIUS_MIN = 500,

    /**道具最大半径 */
    PROP_RADIUS_MAX = 900,

    /**障碍物最小半径 */
    OBSTACLE_RADIUS_MIN = 600,

    /**障碍物最大半径 */
    OBSTACLE_RADIUS_MAX = 600,
}