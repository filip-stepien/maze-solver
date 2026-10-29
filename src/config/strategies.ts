import { AStarStrategy } from '../strategies/MazePathFindStrategy/AStarStrategy';
import { BFSStrategy } from '../strategies/MazePathFindStrategy/BFSStrategy';
import { DFSStrategy } from '../strategies/MazePathFindStrategy/DFSStrategy';
import { BlankMazeStrategy } from '../strategies/generation/BlankMazeStrategy';
import { DFSGenerationStrategy } from '../strategies/generation/DFSGenerationStrategy';
import { KruskalsStrategy } from '../strategies/generation/KrushalsStrategy';
import { PrimsStrategy } from '../strategies/generation/PrimsStrategy';

export const availableStrategies = [new BFSStrategy(), new DFSStrategy(), new AStarStrategy()];

export const availableGenerationStrategies = [
    new BlankMazeStrategy(),
    new PrimsStrategy(),
    new KruskalsStrategy(),
    new DFSGenerationStrategy()
];
