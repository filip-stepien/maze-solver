export type MazeStatLabel = 'candidate' | 'forsaken' | 'queued' | 'selected';

export class MazeStats {
    private _stats = {
        candidate: 0,
        forsaken: 0,
        queued: 0,
        selected: 0
    };

    public reset() {
        this._stats.candidate = 0;
        this._stats.forsaken = 0;
        this._stats.queued = 0;
        this._stats.selected = 0;
    }

    public increment(label: MazeStatLabel) {
        this._stats[label]++;
    }

    public get() {
        return this._stats;
    }
}
