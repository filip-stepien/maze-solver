import { Renderer } from './ui/core/Renderer';
import { OrthographicCamera } from './ui/core/OrthographicCamera';
import { ExampleScene } from './ui/scenes/ExampleScene';
import { BoxScene } from './ui/scenes/BoxScene';
import { View } from './ui/controls/View';
import { Button } from './ui/controls/Button';
import { DropDown } from './ui/controls/DropDown';
import { CheckBox } from './ui/controls/CheckBox';
import { Text } from './ui/controls/Text';

const scene1 = new ExampleScene();
const scene2 = new BoxScene();
const renderer = Renderer.instance;
renderer.camera = new OrthographicCamera(1, 0.1, 1000);
renderer.addScene(scene1, scene2);
renderer.instatiate();

const view = new View();
const button = new Button();
button.value = 'Click me!';
button.onChange = state => console.log(state);
view.addChild(button);

const drop = new DropDown();
drop.onChange = console.log;
drop.addOption('1');
drop.placeholder = 'placeholder';

const check = new CheckBox('Elo');
check.text.color = 'white';
check.onChange = console.log;

const text = new Text('elo elo');
text.color = 'white';
text.fontSize = 24;
