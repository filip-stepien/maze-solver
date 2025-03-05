import { GenerationStrategy } from '../strategies/GenerationStrategy';
import { PrimsStrategy } from '../strategies/PrimsStrategy';

export class MazeGenerator<T extends GenerationStrategy> {
    private generationStrategy: T;
    private cols: number;
    private rows: number;

    constructor(cols: number, rows: number) {
        this.cols = cols;
        this.rows = rows;
    }

    public setGenerationStrategy(strategy: T) {
        this.generationStrategy = strategy;
    }

    public generateMaze() {
        this.generationStrategy.generateMaze(this.cols, this.rows);
    }
}

// example
// npx tsx src/maze/MazeGenerator.ts
const generator = new MazeGenerator(11, 11);
const strategy = new PrimsStrategy();
generator.setGenerationStrategy(strategy);
generator.generateMaze();
