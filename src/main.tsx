import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MediaQueryContextProvider } from './shared/hooks/useMediaQueryContext';
import YandexMetrika from './shared/components/YandexMetriks';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './shared/http.configuration';
import './main.scss';

const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <MediaQueryContextProvider>
      <App />
      <YandexMetrika />
    </MediaQueryContextProvider>
  </StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
