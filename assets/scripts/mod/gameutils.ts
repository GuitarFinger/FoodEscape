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
    public static calcTimeGap = (startTime: number,type: string): boolean => {
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
    /**
     * 判断范围距离
     * @todo 判断重合, 自己宽度
     */
    private static judgeRangeDistance = (nowAngle: number, gap: number, propType: TProp): boolean => {
        const gapAngle = Global.meterPerAngle * gap;
        const multiple = Math.floor(nowAngle/gapAngle);

        if (!FactoryUtils.angle[propType]) {
            FactoryUtils.angle[propType] = Utils.getRangeRandom(multiple*gapAngle, (multiple+1)*gapAngle);

            return false;
        }

        if (FactoryUtils.angle[propType] && nowAngle < FactoryUtils.angle[propType]) {
            return false;
        }

        FactoryUtils.angle[propType] = Utils.getRangeRandom((multiple+1)*gapAngle, (multiple+2)*gapAngle);
        // console.log(`%c ${propType}::${Factory.createAngle[propType]}`, 'background: pink;');

        return true;
    }

    /**
    //  * 判断其它道具
    //  * @todo 判断重合, 自己宽度
    //  */
    // private static judgeOtherProp = (startTime: number) => {
    //     const timeLength = (Date.now()-startTime) / 1000;
    //     const multiple = Math.floor(timeLength/CGame.TIME_GAP_RANGE);

    //     if (!FactoryUtils.createOtherPropTime) {
    //         Factory.createOtherPropTime = Utils.getRangeRandom(multiple*CGame.TIME_GAP_RANGE, (multiple+1)*CGame.TIME_GAP_RANGE);
    //         // console.log(`%c time:: ${Factory.createOtherPropTime}`, 'background: pink;');
    //         return false;
    //     }

    //     if (Factory.createOtherPropTime && timeLength < Factory.createOtherPropTime) {
    //         return false;
    //     }

    //     Factory.createOtherPropTime = Utils.getRangeRandom((multiple+1)*CGame.TIME_GAP_RANGE, (multiple+2)*CGame.TIME_GAP_RANGE);

    //     // console.log(`%c time:: ${Factory.createOtherPropTime}`, 'background: pink;');

    //     return true;
    // }
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
    public static prop = (prefab: cc.Prefab, parent: cc.Node, ptype: TProp): cc.Node => {
        let node = null;
        switch (ptype) {
            case ETProp.BANANA:
                node = Factory.banana(prefab, parent, ptype);
                break;
            case ETProp.BANANA_PEEL:
                break;
            case ETProp.DIAMOND:
                break;
            case ETProp.GOLD:
                break;
            case ETProp.MAGNET:
                break;
            case ETProp.PEPPER:
                break;
            case ETProp.SHIT:
                node = Factory.shit(prefab, parent, ptype);
                break;
            case ETProp.TRAP:
                break;
        }

        return node;
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
}