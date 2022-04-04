import './components/global.css';
import { render as reactDomRender } from 'react-dom';
import { Page } from './components/Page';
import { getMountElement } from './utils/getMountElement';

(() => {
  const app = getMountElement();
  reactDomRender(<Page />, app);
})();
