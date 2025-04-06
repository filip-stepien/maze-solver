import { GenerationStrategy } from './GenerationStrategy';

export class PredefinedMazeStrategy implements GenerationStrategy {
    private _predefinedMaze: boolean[][];

    constructor(predefinedMaze: boolean[][]) {
        this._predefinedMaze = predefinedMaze;
    }

    public generateMaze(cols: number, rows: number): boolean[][] {
        return this._predefinedMaze;
    }
}
