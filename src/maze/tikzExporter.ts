import { Extends } from 'expect-type';
import { Vec2d } from '../types';
import { MazePathFinderExporter } from './mazeExporter';
import { MazeNode } from './MazeNode';
import { MazePathFinderNode } from './MazePathFinderNode';
import { Maze } from './Maze';

export class TikzExporter implements MazePathFinderExporter<MazePathFinderNode> {
    public doExport = (maze: Maze<MazePathFinderNode>) => {
        let tikzRectangles = '';
        // map nodes
        maze.forEachNode(nodeData => {
            const startPos = nodeData.pos;
            const endPos = nodeData.pos.move(new Vec2d([1, 1]));

            let tikzCommand = '';
            switch (nodeData.node.getDisplayedLabel()) {
                case 'colliding':
                    tikzCommand = `\\fill[gray] (${startPos.x}, ${startPos.y}) rectangle (${endPos.x}, ${endPos.y});\n`;
                    break;
            }

            tikzRectangles += tikzCommand;
        });

        // grid
        const tikzGrid = `\\draw[black] grid (${maze.getSize().x}, ${maze.getSize().y});`;

        // map grid
        const tikz = `
\\begin{tikzpicture}
${tikzRectangles}
${tikzGrid}
\\end{tikzpicture}`;

        return tikz;
    };
}
