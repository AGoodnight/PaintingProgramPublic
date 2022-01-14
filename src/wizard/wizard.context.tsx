import { useContext, createContext, useReducer, useEffect } from "react";
import { DEFINED_PANEL_TYPES } from "../constants/artboard.contants";
import {
  DEFINED_WIZARD_STEPS,
  UNTITLED_WIZARD_STEP,
} from "../constants/wizard.constants";
import { StepAPIPayload } from "../models/api.model";
import {
  WizardAction,
  WizardRedux,
  WizardState,
  WizardStepDefinition,
} from "../models/wizard.models";
import { loadFromLocalStorage } from "../store/history";

const stepsToUse = () => {
  if (Object.keys(DEFINED_PANEL_TYPES).length > 0) {
    return DEFINED_WIZARD_STEPS;
  }
  return { untitled: [UNTITLED_WIZARD_STEP] };
};

export const STEPS_TO_USE = stepsToUse();
export const STARTING_STEP = Object.values(STEPS_TO_USE)[0];

const routerAsOfLoadState = loadFromLocalStorage();
const stepAsOfLoad = (localState: any): WizardStepDefinition => {
  if (localState) {
    const locationAsArray: Array<string> =
      localState.router.location.pathname.split("/");
    const lastPathString = locationAsArray.pop();
    return Object.values(stepsToUse()).filter((stepDef) => {
      return stepDef.route === "/" + lastPathString;
    })[0];
  } else {
    return STARTING_STEP;
  }
};

export const WIZARD_INITIAL_STATE: WizardState = {
  id: null,
  steps: Object.values(stepsToUse()),
  currentStep: stepAsOfLoad(routerAsOfLoadState) || DEFINED_WIZARD_STEPS.title,
  currentStepIndex: stepAsOfLoad(routerAsOfLoadState)
    ? stepAsOfLoad(routerAsOfLoadState).order
    : STARTING_STEP.order,
  payload: {} as StepAPIPayload,
};

const wizardReducer = (state: WizardState, action: WizardAction) => {
  const _state = state;

  let newStepDefs = _state.steps;

  switch (action.type) {
    case "setId":
      return Object.assign({}, _state, {
        id: action.value,
      });
    case "nextStep":
      if (_state.currentStep.order <= _state.steps.length) {
        const _nextStep = _state.steps.filter((step) => {
          return step.order === _state.currentStep.order + 1;
        })[0];
        return Object.assign({}, _state, {
          currentStep: _nextStep,
          currentStepIndex: _nextStep.order,
        });
      } else {
        return _state;
      }
    case "previousStep":
      if (_state.currentStep.order > 0) {
        const _previousStep = _state.steps.filter((step) => {
          return step.order === _state.currentStep.order - 1;
        })[0];
        return Object.assign({}, _state, {
          currentStep: _previousStep,
          currentStepIndex: _previousStep.order,
        });
      } else {
        return _state;
      }
    case "setStep":
      const thisStep = action.value as WizardStepDefinition;
      return Object.assign({}, _state, {
        currentStep: action.value,
        currentStepIndex: thisStep.order,
      });

    case "setPayload":
      return Object.assign({}, _state, {
        payload: Object.assign({}, action.value, {
          areaType: _state.currentStep.medium?.key,
        }),
      });

    case "finalizeStep":
      newStepDefs = _state.steps.map((stepDef: WizardStepDefinition) => {
        if (stepDef.order === _state.currentStepIndex) {
          return Object.assign({}, stepDef, {
            complete: true,
          });
        } else {
          return stepDef;
        }
      });
      return Object.assign({}, _state, {
        currentStep: Object.assign({}, _state.currentStep, {
          complete: true,
        }),
        steps: newStepDefs,
      });

    case "resetStep":
      newStepDefs = _state.steps.map((stepDef: WizardStepDefinition) => {
        if (stepDef.order === _state.currentStepIndex) {
          return Object.assign({}, stepDef, {
            complete: false,
          });
        } else {
          return stepDef;
        }
      });
      return Object.assign({}, _state, {
        currentStep: Object.assign({}, _state.currentStep, {
          complete: false,
        }),
        steps: newStepDefs,
      });

    case "newWizardInstance":
      return Object.assign({}, WIZARD_INITIAL_STATE, {
        id: action.value ? action.value : null,
        currentStep: STARTING_STEP,
        currentStepIndex: STARTING_STEP.order,
      });

    case "addWizardStep":
      if (typeof action.value === "object") {
        if (action.value.hasOwnProperty("title")) {
          return Object.assign({}, _state, {
            steps: _state.steps.concat([action.value as WizardStepDefinition]),
          });
        }
        return _state;
      }
      return _state;

    case "removeWizardStep":
      if (typeof action.value === "number") {
        return Object.assign({}, _state, {
          steps: _state.steps.splice(action.value, 1).filter((ele) => ele),
        });
      }
      return _state;
    default:
      return state;
  }
};

const getLocalWizardState = () => {
  const localState = localStorage.getItem("wizardState");
  return localState ? JSON.parse(localState) : WIZARD_INITIAL_STATE;
};

export const WizardContext = createContext<WizardRedux | undefined>(
  getLocalWizardState()
);

export const WizardProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(wizardReducer, getLocalWizardState());
  const value = { state, dispatch };

  useEffect(() => {
    localStorage.setItem("wizardState", JSON.stringify(state));
  }, [state]);

  return (
    <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
  );
};

export const useWizardContext = () => {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error("useWizardContext must be used within a WizardProvider");
  }
  return context;
};
