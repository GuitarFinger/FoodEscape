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

    /**游戏开始 */
    GAME_START = 'game_start',

    /**玩家复活 */
    PLAYER_REVIVE = 'player_revive',

    /**分数改变 */
    SCORE_CHANGE = 'score_change',

    /**创建金币 */
    CREATE_GOLD = 'create_gold',

    /**更新金币进度百分比 */
    UPDATE_GOLD_PRECENT = 'UPDATE_GOLD_PRECENT',

    /**收获金币 */
    COLLECT_GOLD = 'collect_gold',
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
    // ================ 其它
    /**连跳次数 */
    static JUMP_COUNT = 2;
    
    /**初始距离 */
    static INIT_DISTANCE = 100;
    
    /**敌人和玩家之间的最大距离 ENEMY_PLAYER_DISTANCE */
    static E_P_MAX_DISTANCE = 120;

    /**可复活次数 */
    static REVIVE_TIMES = 1;

    /**钻石分数 */
    static DIAMOND_SCORE = 1;

    /**金币产出率(单位秒) */
    static GOLD_OUTPUT_RATE = 10;

    /**金币产出加速(单位毫秒) */
    static GOLD_OUTPUT_ACC = 333;
    // ================ 其它


    // ================ 倍率
    /**中景转动 */
    static P_ROTATE_MULTIPLE = 1/4;
    // ================ 倍率


    // ================ 角度
    /**主游戏场景扇形角 */
    static SECTOR_ANGLE = 60;

    /**主游戏场景扇形角与水平面夹角(PS: 这个扇形角小于180°) [(180-CGame.SECTOR_ANGLE) / 2] */
    static SECTOR_LEVLE_ANGLE = 60;

    /**玩家与水平面夹角 */
    static PLAYER_LEVEL_ANGLE = 85;
    // ================ 角度    


    // ================ 半径
    /**第一半径 */
    static FIRST_RADIUS = 687;
    /**第二半径 */
    static SECOND_RADIUS = 950;
    /**第三半径 */
    static THIRD_RADIUS = 1150;
    /**玩家半径 */
    static PLAYER_RADIUS = 700;
    // ================ 半径


    // ================ 距离间隔
    /**添加距离道具*/
    static THIRD_GAP_RANGE = 100;
    /**钻石距离间隔 */
    static DIAMOND_GAP_RANGE = 50;
    /**捕兽夹距离间隔 */
    static TRAP_GAP_RANGE = 300;
    // ================ 距离间隔


    // ================ 时间间隔
    /**时间间隔范围 */
    static TIME_GAP_RANGE = 3;
    // ================ 时间间隔


    

    // ================ 持续时间
    /**磁性基本持续时间(单位毫秒) */
    static MAGNETIC_DURATOIN = 2000;

    /**护盾基本持续时间(单位毫秒) */
    static SHIELD_DURATION = 5000;

    /**倒计时持续时间(单位秒) */
    static COUNTDOWN_DURATION = 15;

    /**广告持续时间(单位秒) */
    static ADS_DURATION = 15;
    // ================ 持续时间


    // ================ 速度
    /**道具吸引速度*/
    static PROP_ATTRACT_SPEED = 5;
    // ================ 速度


    // ================ 概率
    /**生成钻石 */
    static DIAMOND_ODDS = 0.5;

    // 香蕉-便便概率
    /**香蕉概率 */
    static ODDS_BANANA = 0.4;
    /**便便概率 */
    static ODDS_SHIT = 0.6;
    /**香蕉-便便概率 */
    static ODDS_BA_SH = [
        { ptype: ETProp.BANANA, odds: CGame.ODDS_BANANA },
        { ptype: ETProp.SHIT,   odds: CGame.ODDS_BANANA + CGame.ODDS_SHIT },
    ];

    // 生成辣椒-磁铁概率
    /**辣椒概率 */
    static ODDS_PEPPER = 0.5;
    /**磁铁概率 */
    static ODDS_MAGNET = 0.5;
    /**辣椒磁铁概率 */
    static ODDS_PE_MA = [
        { ptype: ETProp.PEPPER, odds: CGame.ODDS_PEPPER },
        { ptype: ETProp.MAGNET, odds: CGame.ODDS_PEPPER + CGame.ODDS_MAGNET },
    ];

    // ================ 概率
}