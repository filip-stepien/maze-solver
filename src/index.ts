import { Renderer } from './ui/core/Renderer';
import { OrthographicCamera } from './ui/core/OrthographicCamera';
import { ExampleScene } from './ui/scenes/ExampleScene';
import { BoxScene } from './ui/scenes/BoxScene';
import { FlexView } from './ui/controls/FlexView';
import { View } from './ui/controls/View';

const scene1 = new ExampleScene();
const scene2 = new BoxScene();
const renderer = Renderer.instance;
renderer.camera = new OrthographicCamera(1, 0.1, 1000);
renderer.addScene(scene1, scene2);
renderer.instatiate();

const flex = new FlexView();
const view1 = new View();
const view2 = new FlexView();

flex.width = 100;
flex.height = 100;
flex.addChild(view1, view2);
flex.appendDomElement();
