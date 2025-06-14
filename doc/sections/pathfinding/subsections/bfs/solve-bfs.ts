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
facade.generateMaze(new Vec2d({ x: 10, y: 5 }));

const maze = facade.getMazePathFinder();

// maze.setGeneratorStrategy(
//     (() => {
//         const strategy = new PrimsStrategy();
//         // strategy.enableVerboseLogs();
//         return strategy;
//     })()
// );

const exporter = new TikzExporter();

const eventToText = (data: MPFLabelChangeCallbackParams) => {
    switch (data.labelChanged) {
        case 'colliding':
        case 'noncolliding':
        case 'start':
        case 'finish':
        case 'forsaken':
            return 'not implemented';
        case 'queued':
            return `Dodaj do kolejki węzeł ${JSON.stringify(data.pos)}`;
        case 'candidate':
            return `Rozpatrz ${JSON.stringify(data.pos)}`;
        case 'selected':
            return `Wybierz ${JSON.stringify(data.pos)} do finalnej ścierzki`;
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
          ${isFistFigure ? '\\label{fig:bfs_solve_steps}' : ''}
        \\end{figure}
        `;
        out += figure;
        isFistFigure = false;
    }
});

maze.findPath(
    new BFSStrategy(),

    MazeFacade.getRandomNonCollidingNodePositon(maze),
    MazeFacade.getRandomNonCollidingNodePositon(maze)
);

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { KruskalsStrategy } from '../../../../../src/strategies/generation/KrushalsStrategy';
import { Vec2d } from '../../../../../src/types';
import { BFSStrategy } from '../../../../../src/strategies/MazePathFindStrategy/BFSStrategy';

// Get full path of the current file
const __filename = fileURLToPath(import.meta.url);

// Get directory of the current file
const __dirname = dirname(__filename);

fs.writeFileSync(`${__dirname}/figures/bfs_solve_steps.tex`, out);
