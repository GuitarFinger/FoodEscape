// ================== 数据
export class DTip {
    /**
     * 父节点
     */
    parent: cc.Node;
    /**
     * 文本
     */
    text: string;

    constructor (parent: cc.Node, text: string) {
        this.parent = parent;
        this.text = text;
    }
}

// ================== 枚举
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
 * 消息
 */
export enum EMsg {
    /**弹出提示 */
    SCREEN_TIPS = 'screen_tips',

    /**速度改变 */
    SPEED_CHANGE = 'speed_change',
}

/**
 * 道具
 */
export enum ETProp {
    /**香蕉 */
    BANANA = 'banana',
    /**香蕉皮 */
    BANANA_PEEL = 'banana_peel',
    /**钻石 */
    DIAMOND = 'diamond',
    /**金币 */
    GOLD = 'gold',
    /**磁铁 */
    MAGNET = 'magnet',
    /**辣椒 */
    PEPPER = 'pepper',
    /**便便 */
    SHIT = 'shit',
    /**捕兽夹 */
    TRAP = 'trap',
}

// ================== 类型
/**道具 */
export type TProp = ETProp;
export type TPoint = { x: number, y: number };
export type TDuadrant = 0 | 1 | 2 | 3 | 4;

// ================== 常量
/**
 * @desc 游戏常量
 */
export class CGame {
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

    /**主游戏场景扇形角与水平面夹角(PS: 这个扇形角小于180°) [(180-CGame.SECTOR_ANGLE) / 2] */
    static SECTOR_LEVLE_ANGLE = 60;

    /**玩家与水平面夹角 */
    static PLAYER_LEVEL_ANGLE = 85;

    /**第一半径 */
    static FIRST_RADIUS = 687;
    /**第二半径 */
    static SECOND_RADIUS = 950;
    /**第三半径 */
    static THIRD_RADIUS = 1150;
    /**玩家半径 */
    static PLAYER_RADIUS = 700;

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

    /**磁性基本持续时间(单位毫秒) */
    static MAGNETIC_DURATOIN = 2000;

    /**护盾基本持续时间(单位毫秒) */
    static SHIELD_DURATION = 5000;

    /**道具吸引速度*/
    static PROP_ATTRACT_SPEED = 5;
}