import { GenerationStrategy } from './GenerationStrategy';

export class BlankMazeStrategy implements GenerationStrategy {
    public generateMaze(cols: number, rows: number): boolean[][] {
        return new Array(rows).fill(new Array(cols).fill(false));
    }
}
