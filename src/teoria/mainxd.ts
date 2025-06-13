import { MazeFacade } from '../maze/god';
import MazePathFinder from '../maze/MazePathFinder';
import { TikzExporter } from '../maze/tikzExporter';
import { DFSGenerationStategy } from '../strategies/generation/DFSGenerationStrategy';
import { KruskalsStrategy } from '../strategies/generation/KrushalsStrategy';
import { PrimsStrategy } from '../strategies/generation/PrimsStrategy';
import { DFSStrategy } from '../strategies/MazePathFindStrategy/DFSStrategy';
import { Vec2d } from '../types';
import { LegacyBadMazeSerializer } from '../ui/scenes/maze/MazeSerializer';

const maze = new MazeFacade();

maze.setGeneratorStrategy(
    (() => {
        const strategy = new PrimsStrategy();
        // strategy.enableVerboseLogs();
        return strategy;
    })()
);
maze.generateMaze(new Vec2d([5, 5]));

const exporter = new TikzExporter();

maze.getMazePathFinder().addNodeLabelChangeObserver(data => {
    // if added label
    if (data.node.hasLabel(data.labelChanged)) {
        console.log(exporter.doExport(maze.getMazePathFinder()));
    }
});

maze.getMazePathFinder().findPath(
    new DFSStrategy(),
    maze.getRandomNonCollidingNodePositon(),
    maze.getRandomNonCollidingNodePositon()
);
