import React, { useState, useEffect, useCallback } from "react";
import { FinalizeButton } from "../toolbar/finalizeButton";
import { useWizardContext } from "./wizard.context";

const WizardNavigation: React.FC = () => {
  const { state, dispatch } = useWizardContext();

  const [previousProps, setPreviousProps] = useState<
    Record<string, number | string | boolean>
  >({});

  const [nextProps, setNextProps] = useState<
    Record<string, number | string | boolean>
  >({});

  const handleNext = () => {
    dispatch({
      type: "nextStep",
    });
  };

  const handlePrevious = () => {
    dispatch({
      type: "previousStep",
    });
  };

  const updateState = useCallback(
    (preState?: boolean) => {
      const createPreviousProps = () => {
        return {
          disabled: state.currentStepIndex === 0,
        };
      };
      const createNextProps = () => {
        return {
          disabled:
            state.currentStepIndex === state.steps.length - 1 ||
            !state.currentStep.complete,
        };
      };

      setPreviousProps(createPreviousProps());
      setNextProps(createNextProps());
    },
    [state.currentStep, state.currentStepIndex, state.steps]
  );

  useEffect(() => {
    updateState();
  }, [state.currentStep, updateState]);

  return (
    <div className="uk-flex ec-basebar">
      <div className="uk-button-bar rounded-ends">
        {state.currentStep.order > 0 && (
          <button
            className="uk-button uk-button-default uk-button-small"
            onClick={handlePrevious}
            uk-tooltip={"Go to the previous step"}
            {...previousProps}
          >
            Previous
          </button>
        )}
        <FinalizeButton />
        {state.currentStep.order < state.steps.length - 1 && (
          <button
            className="uk-button uk-button-default uk-button-small"
            uk-button
            uk-tooltip={
              state.currentStep.complete
                ? "Go to the next step"
                : "You must finalize this step before continuing"
            }
            title={
              state.currentStep.complete
                ? "Go to the next step"
                : "You must finalize this step before continuing"
            }
            onClick={handleNext}
            {...nextProps}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default WizardNavigation;
