  
import { h, render } from 'preact';
import App from './app/App';

if (module.hot) {
    module.hot.accept()
  }

const $root = document.getElementById('app') as HTMLElement;

render(<App />, $root);