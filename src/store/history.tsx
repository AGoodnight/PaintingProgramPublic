import { createBrowserHistory } from "history";
import { applyMiddleware, compose, createStore } from "redux";
import { routerMiddleware } from "connected-react-router";
import createRootReducer from "./reducers";
import { STEPS_TO_USE } from "../wizard/wizard.context";
import { WizardStepDefinition } from "../models/wizard.models";

export const history = createBrowserHistory();

// convert object to string and store in localStorage
export function saveToLocalStorage(state: unknown) {
  try {
    const serialisedState = JSON.stringify(state);
    localStorage.setItem("persistantState", serialisedState);
  } catch (e) {
    console.warn(e);
  }
}

// load string from localStarage and convert into an Object
// invalid output must be undefined
export function loadFromLocalStorage() {
  try {
    const serialisedState = localStorage.getItem("persistantState");
    if (serialisedState === null) return undefined;
    return JSON.parse(serialisedState);
  } catch (e) {
    console.warn(e);
    return undefined;
  }
}

export const routerState = () => {
  const routerAsOfLoadState = loadFromLocalStorage();
  const stepAsOfLoad = (localState: any): WizardStepDefinition => {
    const locationAsArray: Array<string> =
      localState.router.location.pathname.split("/");
    const lastPathString = locationAsArray.pop();
    return Object.values(STEPS_TO_USE).filter((stepDef) => {
      return stepDef.route === "/" + lastPathString;
    })[0];
  };

  return { routerAsOfLoadState, stepAsOfLoad };
};

export default function configureStore() {
  const store = createStore(
    createRootReducer(history), // root reducer with router state,
    loadFromLocalStorage(),
    compose(
      applyMiddleware(
        routerMiddleware(history) // for dispatching history actions
        // ... other middlewares ...
      )
    )
  );

  return store;
}
