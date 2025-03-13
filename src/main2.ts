import { MazeFacade } from './maze/god';
import { MazeGenerator } from './maze/MazeGenerator';
import MazePathFinder from './maze/MazePathFinder';
import { AStarStrategy } from './strategies/MazePathFindStrategy/AStarStrategy';
import { PrimsStrategy } from './strategies/PrimsStrategy';
import { Vec2d } from './types';
import { Sleep } from './utils/Sleep';

const mazeFacade = new MazeFacade();

mazeFacade.setGeneratorStrategy(new PrimsStrategy());
mazeFacade.generateMaze(new Vec2d([10, 10]));

const maze = mazeFacade.getMazePathFinder();

console.log(maze.toString());

async function locker() {
    console.log('bb');
    // ustawi w buttonie onClicka
    return new Promise<void>(resolve => {
        // czkenaie na klikniecie
        resolve();
    });
}

maze.addNodeLabelChangeObserver(async ({ labelChanged, node, pos }) => {
    // if removed ignore
    if (!node.hasLabel(labelChanged)) return;

    await locker();
    console.log('aa');
});

const { start, end } = mazeFacade.randomizeStartEndPositions();

maze.findPath(new AStarStrategy(), start, end);

console.log(maze.toString());
