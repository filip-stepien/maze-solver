import { MazeFacade } from './maze/god';
import { Maze } from './maze/Maze';
import { DFSGenerationStategy } from './strategies/generation/DFSGenerationStrategy';
import { KruskalsStrategy } from './strategies/generation/KrushalsStrategy';
import { PrimsStrategy } from './strategies/generation/PrimsStrategy';
import { Vec2d } from './types';

const strategyies = [new PrimsStrategy(), new KruskalsStrategy(), new DFSGenerationStategy()];

for (const strategy of strategyies) {
    const maze = new MazeFacade();
    maze.setGeneratorStrategy(strategy);
    maze.generateMaze(new Vec2d([100, 30]));

    console.log(maze.getMazePathFinder().toString());
}
