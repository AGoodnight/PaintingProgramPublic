import "uikit/dist/js/uikit";
import "uikit/dist/js/uikit-icons";
import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import { Provider } from "react-redux";
import reportWebVitals from "./reportWebVitals";
import { Switch } from "react-router";
import configureStore, { history, saveToLocalStorage } from "./store/history";
import { ConnectedRouter } from "connected-react-router";
import Layout from "./layout/layout";
import { AppRoutes } from "./routes";
import { WizardProvider } from "./wizard/wizard.context";
import { ToolBarProvider } from "./toolbar/toolbar.context";
import { ArtBoardProvider } from "./artboard/artboard.context";
import { NotificationsProvider } from "./notifications/notifications.context";

const store = configureStore();
// listen for store changes and use saveToLocalStorage to
// save them to localStorage
store.subscribe(() => saveToLocalStorage(store.getState()));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <NotificationsProvider>
          <WizardProvider>
            <ToolBarProvider>
              <ArtBoardProvider>
                <Layout>
                  <Switch>{AppRoutes}</Switch>
                </Layout>
              </ArtBoardProvider>
            </ToolBarProvider>
          </WizardProvider>
        </NotificationsProvider>
      </ConnectedRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
