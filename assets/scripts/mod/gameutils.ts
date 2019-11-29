import { TProp, ETProp, CGame } from "./enum";
import { Global } from "./global";
import { Utils } from "./utils";

export class FactoryUtils {
    /**
     * 创建角度
     */
    private static angle = {};

    /**
     * 创建时间
     */
    private static time = {};

    /**
     * 计算时间间隔
     */
    public static calcTimeGap = (startTime: number, type: string): boolean => {
        let timeLen: number, multiple: number, minTime: number, maxTime: number;

        timeLen = (Date.now() - startTime) / 1000;
        multiple = Math.floor(timeLen / CGame.TIME_GAP_RANGE);

        if (!FactoryUtils.time[type]) {
            minTime = multiple * CGame.TIME_GAP_RANGE;
            maxTime = (multiple+1) * CGame.TIME_GAP_RANGE;
            FactoryUtils.time[type] = Utils.getRangeRandom(minTime, maxTime);

            return false;
        }

        if (FactoryUtils.time[type] && timeLen < FactoryUtils.time[type]) return false;

        minTime = (multiple+1) * CGame.TIME_GAP_RANGE;
        maxTime = (multiple+2) * CGame.TIME_GAP_RANGE;
        FactoryUtils.time[type] = Utils.getRangeRandom(minTime, maxTime);

        return true;
    }

    /**
     * 计算距离间隔
     */
    public static calcDistanceGap = (angle: number, gap: number, type: string): boolean => {
        let gapAngle: number, multiple: number, minAngle: number, maxAngle: number;

        gapAngle = Global.meterPerAngle * gap;
        multiple = Math.floor(angle / gapAngle);

        if (!FactoryUtils.angle[type]) {
            minAngle = multiple * gapAngle;
            maxAngle = (multiple + 1) * gapAngle;
            FactoryUtils.angle[type] = Utils.getRangeRandom(minAngle, maxAngle);

            return false;
        }

        if (FactoryUtils.angle[type] && angle < FactoryUtils.angle[type]) return false;

        minAngle = (multiple + 1) * gapAngle;
        maxAngle = (multiple + 2) * gapAngle;
        FactoryUtils.angle[type] = Utils.getRangeRandom(minAngle, maxAngle);

        return true;
    }

    /**
     * 计算概率
     */
    public static calcOdds = (odds: number, flag: boolean = false): boolean => {
        const random = Math.random();
        
        return flag ? odds >= random : odds <= random;
    }

    /**创建道具 */
    public static createProp = (prefab: cc.Prefab, parent: cc.Node, ptype: TProp, radius: number) => {
        let node: cc.Node, angle: number, worldX: number, worldY: number, nodeXY: cc.Vec2;

        node = cc.instantiate(prefab);
        angle = Utils.convertAngle(CGame.SECTOR_LEVLE_ANGLE);
        worldX = Math.cos(angle * Math.PI / 180) * radius + 375;
        worldY = Math.sin(angle * Math.PI / 180) * radius;
        nodeXY = Global.mainGame.node.convertToNodeSpaceAR(cc.v2(worldX, worldY));

        node.getComponent('Prop').init(
            nodeXY.x, nodeXY.y, angle, ptype, radius
        );

        parent.addChild(node);

        return node;
    }
}

export class Factory {
    /**
     * 玩家
     * @param 预制体
     * @parent 父节点
     */
    public static player = (prefab: cc.Prefab, parent: cc.Node): cc.Node => {
        const node = cc.instantiate(prefab);

        parent.addChild(node);

        return node;
    }

    /**
     * 敌人
     * @param 预制体
     * @parent 父节点
     */
    public static enemy = (prefab: cc.Prefab, parent: cc.Node): cc.Node => {
        const node = cc.instantiate(prefab);

        parent.addChild(node);

        return node;
    }

    /**
     * 道具
     */
    public static prop = (prefab: cc.Prefab, parent: cc.Node, ptype: TProp, refAngle?: number): cc.Node => {
        let node = null;
        switch (ptype) {
            case ETProp.BANANA:
                node = Factory.banana(prefab, parent, ptype);
                break;
            case ETProp.BANANA_PEEL:
                break;
            case ETProp.DIAMOND:
                node = Factory.diamond(prefab, parent, ptype, refAngle);
                break;
            case ETProp.GOLD:
                break;
            case ETProp.MAGNET:
                node = Factory.magnet(prefab, parent, ptype, refAngle);
                break;
            case ETProp.PEPPER:
                node = Factory.pepper(prefab, parent, ptype, refAngle);
                break;
            case ETProp.SHIT:
                node = Factory.shit(prefab, parent, ptype);
                break;
            case ETProp.TRAP:
                node = Factory.trap(prefab, parent, ptype, refAngle);
                break;
        }

        return node;
    }

    /**
     * 钻石(第一层)
     */
    private static diamond = (prefab: cc.Prefab, parent: cc.Node, ptype: TProp, refAngle: number) => {
        if (!FactoryUtils.calcOdds(CGame.DIAMOND_ODDS)) return;

        if (!FactoryUtils.calcDistanceGap(refAngle, CGame.DIAMOND_GAP_RANGE, ptype)) return;

        return FactoryUtils.createProp(prefab, parent, ptype, CGame.FIRST_RADIUS);
    }

    /**
     * 捕兽夹(第一层)
     */
    private static trap = (prefab: cc.Prefab, parent: cc.Node, ptype: TProp, refAngle: number) => {
        if (!FactoryUtils.calcDistanceGap(refAngle, CGame.TRAP_GAP_RANGE, ptype)) return;

        return FactoryUtils.createProp(prefab, parent, ptype, CGame.FIRST_RADIUS);
    }

    /**
     * 香蕉(第二层)
     */
    private static banana = (prefab: cc.Prefab, parent: cc.Node, ptype: TProp) => {
        if (!FactoryUtils.calcTimeGap(Global.mainGame.startRotateTime, 'second')) return;

        return FactoryUtils.createProp(prefab, parent, ptype, CGame.SECOND_RADIUS);

    }

    /**
     * 便便(第二层)
     */
    private static shit = (prefab: cc.Prefab, parent: cc.Node, ptype: TProp) => {
        if (!FactoryUtils.calcTimeGap(Global.mainGame.startRotateTime, 'second')) return;

        return FactoryUtils.createProp(prefab, parent, ptype, CGame.SECOND_RADIUS);
    }

    /**
     * 磁铁(第三层)
     */
    private static magnet = (prefab: cc.Prefab, parent: cc.Node, ptype: TProp, refAngle: number) => {
        if (!FactoryUtils.calcDistanceGap(refAngle, CGame.THIRD_GAP_RANGE, 'third')) return;

        return FactoryUtils.createProp(prefab, parent, ptype, CGame.THIRD_RADIUS);
    }

    /**
     * 辣椒(第三层)
     */
    private static pepper = (prefab: cc.Prefab, parent: cc.Node, ptype: TProp, refAngle: number) => {
        if (!FactoryUtils.calcDistanceGap(refAngle, CGame.THIRD_GAP_RANGE, 'third')) return;

        return FactoryUtils.createProp(prefab, parent, ptype, CGame.THIRD_RADIUS);
    }
}