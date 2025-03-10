import { AStarStrategy } from '../strategies/MazePathFindStrategy/AStarStrategy';
import { BFSStrategy } from '../strategies/MazePathFindStrategy/BFSStrategy';
import { DFSStrategy } from '../strategies/MazePathFindStrategy/DFSStrategy';

export const availableStrategies = [new BFSStrategy(), new DFSStrategy(), new AStarStrategy()];
