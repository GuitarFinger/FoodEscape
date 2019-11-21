export interface IRole {
    /**spine骨骼 */
    selfSkeleton: sp.Skeleton;

    /**设置时间缩放 */
    setTimeScale (scale: number): void;

    /**重置数据 */
    resetData (): void;
}