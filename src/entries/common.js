import ReactDOM from 'react-dom';
import '@/styles/global.scss';
import App from '@/components/shared/App';

export function appInit() {
  const appRoot = window.document.getElementById('app-root');

  ReactDOM.render(<App />, appRoot);
}

appInit();
