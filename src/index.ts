import { Renderer } from './ui/core/Renderer';
import { OrthographicCamera } from './ui/core/OrthographicCamera';
import { ExampleScene } from './ui/scenes/ExampleScene';
import { BoxScene } from './ui/scenes/BoxScene';
import { FlexView } from './ui/controls/FlexView';
import { View } from './ui/controls/View';
import { GridView } from './ui/controls/GridView';

const scene1 = new ExampleScene();
const scene2 = new BoxScene();
const renderer = Renderer.instance;
renderer.camera = new OrthographicCamera(1, 0.1, 1000);
renderer.addScene(scene1, scene2);
renderer.instatiate();

const grid = new GridView();
const view1 = new View();
const view2 = new View();
const view3 = new View();

view1.width = 100;
view2.width = 100;
view3.width = 100;

view1.height = 100;
view2.height = 100;
view3.height = 100;

grid.columns = [1, 1];
grid.rows = ['200px', '200px'];
grid.itemPlacement = 'center';
grid.addChild(view1, view2, view3);
