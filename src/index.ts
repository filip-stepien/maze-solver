import { Renderer } from './ui/core/Renderer';
import { OrthographicCamera } from './ui/core/OrthographicCamera';
import { View } from './ui/controls/View';
import { Button } from './ui/controls/Button';
import { DropDown } from './ui/controls/DropDown';
import { CheckBox } from './ui/controls/CheckBox';
import { Text } from './ui/controls/Text';
import { RangeSlider } from './ui/controls/RangeSlider';
import { MazeScene } from './ui/scenes/maze/MazeScene';
import { Model3D } from './ui/core/Model3D';
import { ModelGroup } from './ui/core/ModelGroup';

const renderer = Renderer.instance;
renderer.camera = new OrthographicCamera(1, 0.1, 10000);
renderer.scene = new MazeScene();
renderer.debugMode = false;
renderer.start();
