export interface GenerationStrategy {
    generateMaze(cols: number, rows: number): number[][];
}
