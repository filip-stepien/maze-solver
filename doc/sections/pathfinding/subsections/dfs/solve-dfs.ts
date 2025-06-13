import { MazeFacade } from '../../../../../src/maze/god';
import MazePathFinder, {
    MPFLabelChangeCallbackParams
} from '../../../../../src/maze/MazePathFinder';
import { MazePathFinderNode } from '../../../../../src/maze/MazePathFinderNode';
import { TikzExporter } from '../../../../../src/maze/tikzExporter';
import { DFSStrategy } from '../../../../../src/strategies/MazePathFindStrategy/DFSStrategy';
import fs from 'fs';

const maze = new MazePathFinder({
    nodeFactory: () => {
        return new MazePathFinderNode();
    },
    collsionState: [
        [1, 0, 0, 0, 1],
        [1, 1, 0, 1, 1],
        [0, 1, 1, 1, 0],
        [1, 1, 0, 1, 1],
        [0, 1, 1, 1, 0]
    ].map(row => row.map(e => e === 0))
});

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
            return 'not implemented';
        case 'candidate':
            return `Oznacz ${JSON.stringify(data.pos)} jako kandydata`;
        case 'forsaken':
            return `Oznacz ${JSON.stringify(data.pos)} jako zapomniany`;
        case 'selected':
            return `Wybierz ${JSON.stringify(data.pos)} do finalnej ścierzki`;
        case 'queued':
            return `Wybierz ${JSON.stringify(data.pos)} jako następnie rozpatywany węzeł`;
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
          ${isFistFigure ? '\\label{fig:dfs_solve_steps}' : ''}
        \\end{figure}
        `;
        out += figure;
        isFistFigure = false;
    }
});

maze.findPath(
    new DFSStrategy(),

    MazeFacade.getRandomNonCollidingNodePositon(maze),
    MazeFacade.getRandomNonCollidingNodePositon(maze)
);

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get full path of the current file
const __filename = fileURLToPath(import.meta.url);

// Get directory of the current file
const __dirname = dirname(__filename);

fs.writeFileSync(`${__dirname}/figures/dfs_solve_steps.tex`, out);
