import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './index.css';
import { ColorModeScript } from '@chakra-ui/react';
import theme from './theme';
import { registerSW } from 'virtual:pwa-register';

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
