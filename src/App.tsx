import React, { memo } from 'react';
import Public from './public';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import AdminApp from './admin-app';
import { ADMIN_ROUTES } from './admin-app/roures.definition';
import { QueryClientProvider } from 'react-query';
import { useEventListener } from '@restart/hooks';
import useMountEffect from '@restart/hooks/useMountEffect';
import { queryClient } from './shared/query-client.config';
import { Page404 } from './shared/components/StatusPage';
import { PUBLIC_ROUTES } from './public/roures.definition';
import NotFound from './shared/components/StatusPage/Page404/NotFound';
import { StompSessionProvider } from 'react-stomp-hooks';
import { getServerBaseUrl } from './utils/env-utils';
import Notification from './admin-app/shared/layout/ToastNotification';
import { getAuthenticationHeader } from './shared/http.configuration';
import { LocalStorage } from './utils/LocalStorage';

const WEBSOCKET_URL = `${getServerBaseUrl()}/ws`;
const WS_RECONNECT_DELAY = 2000;
const WS_NO_RECONNECT_DELAY = 1000000;

const websocketConfig = {
  heartbeatIncoming: 0,
  heartbeatOutgoing: 10_000, // ms
  url: WEBSOCKET_URL,
};

const appHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty('--app-height', `${window.innerHeight}px`);
};

const App = () => {
  useEventListener(window, 'resize', appHeight);
  useMountEffect(appHeight);

  const stopmWsConfig = {
    ...websocketConfig,
    reconnectDelay: Boolean(LocalStorage.getToken() && LocalStorage.getUserEmail())
      ? WS_RECONNECT_DELAY
      : WS_NO_RECONNECT_DELAY,
    connectHeaders: {
      Authorization: getAuthenticationHeader(),
    },
    // debug: (msg: string) => console.log(msg),
  };

  return (
    <QueryClientProvider client={queryClient}>
      <StompSessionProvider {...stopmWsConfig}>
        <Notification />
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<Public />} />
            <Route path={`${ADMIN_ROUTES.index}/*`} element={<AdminApp />} />
            <Route path={PUBLIC_ROUTES.notFound} element={<Page404 />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </StompSessionProvider>
    </QueryClientProvider>
  );
};

export default memo(App);
