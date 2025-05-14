import { Extends } from 'expect-type';
import { Vec2d } from '../types';
import { MazePathFinderExporter } from './mazeExporter';
import { MazeNode } from './MazeNode';
import { MazePathFinderNode, MazePathFinderNodeLabel } from './MazePathFinderNode';
import { Maze } from './Maze';
import { beforeAll } from 'vitest';

export class TikzExporter implements MazePathFinderExporter<MazePathFinderNode> {
    public doExport = (maze: Maze<MazePathFinderNode>) => {
        let tikzRectangles = '';
        // map nodes
        maze.forEachNode(nodeData => {
            const startPos = nodeData.pos;
            const endPos = nodeData.pos.move(new Vec2d([1, 1]));

            let tikzCommand = '';
            const representation = nodeData.node.getRepresentation();
            const label = nodeData.node.getDisplayedLabel();

            switch (label) {
                case 'colliding':
                    tikzCommand = `\\fill[${representation.bgColor ?? 'gray'}] (${startPos.x}, ${
                        startPos.y
                    }) rectangle (${endPos.x}, ${endPos.y});\n`;
                    break;
                case 'noncolliding':
                    return;
                default: {
                    const iconPos = startPos.move(new Vec2d([0.5, 0.5]));
                    const faName = nodeData.node.getRepresentation().fontAwesomeName;
                    const color = nodeData.node.getRepresentation().color;
                    // \node at (4.5, 4.5){\faIcon{home}};
                    tikzCommand = `\\node at (${iconPos.x}, ${iconPos.y}){\\color{${color}}\\faIcon{${faName}}};\n`;
                }
            }

            tikzRectangles += tikzCommand;
        });

        // grid
        const tikzGrid = `\\draw[black] grid (${maze.getSize().x}, ${maze.getSize().y});`;

        // map grid
        const tikz = `
\\begin{tikzpicture}
${tikzRectangles}${tikzGrid}
\\end{tikzpicture}`;

        return tikz;
    };
}
