import { GenerationStrategy } from './GenerationStrategy';

export class BlankMazeStrategy implements GenerationStrategy {
    public generateMaze(cols: number, rows: number): boolean[][] {
        return new Array(cols).fill(new Array(rows).fill(false));
    }
}
