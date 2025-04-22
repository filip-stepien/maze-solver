import dayjs from 'dayjs';
import { Vec2d } from '../../../types';
import { MazePathFinderNode } from '../../../maze/MazePathFinderNode';
import MazePathFinder from '../../../maze/MazePathFinder';

export class MazeSerializer {
    public static save(
        mazeFinder: MazePathFinder<MazePathFinderNode>,
        mazeSize: Vec2d,
        start: Vec2d,
        finish: Vec2d
    ) {
        const maze: string[][] = [];

        let row: string[] = [];
        mazeFinder.forEachNode(({ node, pos, i }) => {
            if (pos.equals(start)) {
                row.push('+');
            } else if (pos.equals(finish)) {
                row.push('=');
            } else {
                row.push(Number(node.isColliding()).toString());
            }

            if (pos.x === mazeSize.x - 1) {
                maze.push(row);
                row = [];
            }
        });

        const mazeStr = maze.map(row => row.join(',')).join('\n');
        const blob = new Blob([mazeStr], { type: 'text/plain' });
        const link = document.createElement('a');

        link.href = URL.createObjectURL(blob);
        link.download = `maze_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.txt`;
        link.click();
        link.remove();
    }

    public static load(
        fileContent: string
    ): { maze: boolean[][]; start: Vec2d; finish: Vec2d } | null {
        const mazeStructureRegex = /^(\+|=|0|1|,|(\r?\n))*$/;

        const hasCorrectCharacters = mazeStructureRegex.test(fileContent);
        if (!hasCorrectCharacters) {
            console.warn(
                'Failed to parse the maze from the file.' +
                    'The file has invalid characters. ' +
                    'Valid characters are: `0`, `1`, `+`, `=`, `,` and newline characters.'
            );
            return null;
        }

        let start: Vec2d, finish: Vec2d;
        const maze = fileContent.split(/\r?\n/).map((row, y) =>
            row.split(',').map((wall, x) => {
                switch (wall) {
                    case '0':
                        return false;
                    case '1':
                        return true;
                    case '+':
                        start = new Vec2d([x, y]);
                        return false;
                    case '=':
                        finish = new Vec2d([x, y]);
                        return false;
                }
            })
        );

        const invalidRowIdx = maze.findIndex(row => row.length !== maze[0].length);
        if (invalidRowIdx !== -1) {
            console.warn(
                'Failed to parse the maze from the file. ' +
                    'Row sizes are inconsistent. ' +
                    `Row at line ${invalidRowIdx + 1} has ${
                        maze[invalidRowIdx].length
                    } elements, ` +
                    `while the first row contains ${maze[0].length} elements.`
            );
            return null;
        }

        if (maze.length < 10 || maze[0].length < 10) {
            console.warn(
                'Failed to parse the maze from the file. The maze must be at least 10x10.'
            );
            return null;
        }

        const hasAtLeastTwoPathNodes = maze.flat().filter(node => !node).length;
        if (!hasAtLeastTwoPathNodes) {
            console.warn(
                'Failed to parse the maze from the file. The maze must have at least 2 path nodes.'
            );
            return null;
        }

        return { maze, start, finish };
    }
}
