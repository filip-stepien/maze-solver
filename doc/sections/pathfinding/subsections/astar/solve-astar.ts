import { MazeFacade } from '../../../../../src/maze/god';
import MazePathFinder, {
    MPFLabelChangeCallbackParams
} from '../../../../../src/maze/MazePathFinder';
import { MazePathFinderNode } from '../../../../../src/maze/MazePathFinderNode';
import { TikzExporter } from '../../../../../src/maze/tikzExporter';
import { DFSStrategy } from '../../../../../src/strategies/MazePathFindStrategy/DFSStrategy';
import fs from 'fs';

const facade = new MazeFacade();

facade.setGeneratorStrategy(new KruskalsStrategy());
facade.generateMaze(new Vec2d({ x: 5, y: 5 }));

const maze = facade.getMazePathFinder();

// maze.setGeneratorStrategy(
//     (() => {
//         const strategy = new PrimsStrategy();
//         // strategy.enableVerboseLogs();
//         return strategy;
//     })()
// );

const exporter = new TikzExporter();

const posToText = (vec: Vec2d) => {
    return `x: ${vec.x} y: ${vec.y}`;
};

const eventToText = (data: MPFLabelChangeCallbackParams) => {
    switch (data.labelChanged) {
        case 'colliding':
        case 'noncolliding':
        case 'start':
        case 'finish':
        case 'forsaken':
            return 'not implemented';
        case 'queued':
            return `Dodaj do kolejki węzeł ${posToText(data.pos)}`;
        case 'candidate':
            return `Rozpatrz ${posToText(data.pos)}`;
        case 'selected':
            return `Wybierz ${posToText(data.pos)} do finalnej ścierzki`;
    }
};

let out = '';
let isFistFigure = true;

maze.addNodeLabelChangeObserver(data => {
    // if added label
    if (data.node.hasLabel(data.labelChanged) && !['start', 'finish'].includes(data.labelChanged)) {
        const figure = `
        \\begin{figure}[H]
          ${!isFistFigure ? '\\ContinuedFloat' : ''}
          \\centering
          ${exporter.doExport(maze)}
          \\caption{${eventToText(data)}}
          ${isFistFigure ? '\\label{fig:astar_solve_steps}' : ''}
        \\end{figure}
        `;
        out += figure;
        isFistFigure = false;
    }
});

maze.findPath(
    new AStarStrategy(),

    MazeFacade.getRandomNonCollidingNodePositon(maze),
    MazeFacade.getRandomNonCollidingNodePositon(maze)
);

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { KruskalsStrategy } from '../../../../../src/strategies/generation/KrushalsStrategy';
import { Vec2d } from '../../../../../src/types';
import { BFSStrategy } from '../../../../../src/strategies/MazePathFindStrategy/BFSStrategy';
import { AStarStrategy } from '../../../../../src/strategies/MazePathFindStrategy/AStarStrategy';

// Get full path of the current file
const __filename = fileURLToPath(import.meta.url);

// Get directory of the current file
const __dirname = dirname(__filename);

fs.writeFileSync(`${__dirname}/figures/astar_solve_steps.tex`, out);
