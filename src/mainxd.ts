import { MazeFacade } from './maze/god';
import { Maze } from './maze/Maze';
import { TikzExporter } from './maze/tikzExporter';
import { DFSGenerationStategy } from './strategies/generation/DFSGenerationStrategy';
import { KruskalsStrategy } from './strategies/generation/KrushalsStrategy';
import { PrimsStrategy } from './strategies/generation/PrimsStrategy';
import { Vec2d } from './types';
const strategyies = [new PrimsStrategy(), new KruskalsStrategy(), new DFSGenerationStategy()];

for (const strategy of strategyies) {
    const maze = new MazeFacade();
    maze.setGeneratorStrategy(strategy);
    maze.generateMaze(new Vec2d([11, 7]));

    console.log(maze.getMazePathFinder().toString());
    const exporter = new TikzExporter();
    console.log(exporter.doExport(maze.getMazePathFinder()));
}
