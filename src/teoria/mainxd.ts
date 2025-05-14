import { MazeFacade } from '../maze/god';
import { TikzExporter } from '../maze/tikzExporter';
import { DFSGenerationStategy } from '../strategies/generation/DFSGenerationStrategy';
import { KruskalsStrategy } from '../strategies/generation/KrushalsStrategy';
import { PrimsStrategy } from '../strategies/generation/PrimsStrategy';
import { DFSStrategy } from '../strategies/MazePathFindStrategy/DFSStrategy';
import { Vec2d } from '../types';
import { LegacyBadMazeSerializer } from '../ui/scenes/maze/MazeSerializer';

const maze = new MazeFacade();
maze.setGeneratorStrategy(new PrimsStrategy());
maze.generateMaze(new Vec2d([11, 7]));

// console.log(maze.getMazePathFinder().toString());
const exporter = new TikzExporter();
console.log(exporter.doExport(maze.getMazePathFinder()));

maze.getMazePathFinder().findPath(
    new DFSStrategy(),
    maze.getRandomNonCollidingNodePositon(),
    maze.getRandomNonCollidingNodePositon()
);
