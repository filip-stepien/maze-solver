import { Renderer } from './ui/core/Renderer';
import { OrthographicCamera } from './ui/core/OrthographicCamera';
import { View } from './ui/controls/View';
import { Button } from './ui/controls/Button';
import { DropDown } from './ui/controls/DropDown';
import { CheckBox } from './ui/controls/CheckBox';
import { Text } from './ui/controls/Text';
import { RangeSlider } from './ui/controls/RangeSlider';
import { MazeScene } from './ui/scenes/MazeScene';

const renderer = Renderer.instance;
const mazeScene = new MazeScene();
renderer.camera = new OrthographicCamera(1, 0.1, 1000);
renderer.addScene(mazeScene);
renderer.instatiate();
