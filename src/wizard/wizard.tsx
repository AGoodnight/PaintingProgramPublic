import React, { useEffect, useCallback, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useArtBoardContext } from "../artboard/artboard.context";
import { WIZARD_BASE } from "../constants/wizard.constants";
import { ModalConfiguration } from "../models/notifications.models";
import { WizardStepDefinition } from "../models/wizard.models";
import { useNotificationsContext } from "../notifications/notifications.context";
import WizardNavigation from "./wizard-navigation";
import { ArtboardToolBar } from "../toolbar/toolbar";
import { WizardRoutes } from "./routes";
import { useWizardContext } from "./wizard.context";
import useCursorPosition from "../hooks/useCursorPosition";
import useReactEnv from "../hooks/useReactEnv";
import { ConfigurationToolBar } from "../toolbar/configurationToolbar";
import useNewWizardSteps from "../hooks/useNewWizardSteps";

const Wizard: React.FC = () => {
  const history = useHistory();
  const { state: wizardState, dispatch: dispatchOnWizard } = useWizardContext();
  const { state: artBoardState, dispatch: dispatchOnArtBoard } =
    useArtBoardContext();
  const { state: notificationsState, dispatch: dispatchOnNotifications } =
    useNotificationsContext();

  const { usePaintOptions } = useReactEnv();
  const [hasPaintOptions] = useState<boolean>(usePaintOptions);
  const { createNewStep } = useNewWizardSteps();

  const nextStep = useCallback(
    (nextRoute: WizardStepDefinition) => {
      history.push(WIZARD_BASE.route + nextRoute.route);
    },
    [history]
  );
  const { isWithin } = useCursorPosition();

  useEffect(() => {
    nextStep(wizardState.currentStep);
  }, [wizardState, nextStep, dispatchOnWizard]);

  const canNavigateToNextStep = (stepDef: WizardStepDefinition): boolean => {
    let s = wizardState.steps.filter((step: WizardStepDefinition) => {
      return step.order > -1 && step.order === stepDef.order - 1;
    });
    if (stepDef.order <= 0) {
      return true;
    }
    if (s.length > 0) {
      return s[0].complete;
    } else {
      return false;
    }
  };

  const stepHasBeenFinalized = (stepDef: WizardStepDefinition) => {
    const thisStep = wizardState.steps.filter(
      (step: WizardStepDefinition) => step.order === stepDef.order
    )[0];
    return thisStep.complete;
  };

  const stepIsActive = (stepDef: WizardStepDefinition) => {
    return stepDef.order === wizardState.currentStep.order;
  };

  const showToolBar = (): boolean => {
    return (
      wizardState.currentStep.toolBarTools !== null &&
      wizardState.currentStep.toolBarTools !== undefined
    );
  };

  const handleAddPanel = () => {
    dispatchOnWizard({
      type: "addWizardStep",
      value: createNewStep(
        {
          title: "new Step",
          route: "/newstep",
        },
        wizardState
      ) as WizardStepDefinition,
    });
  };

  const handleMouseMove = (event: unknown) => {
    if (artBoardState.currentArtBoard) {
      if (artBoardState.currentArtBoard.container) {
        const _isWithin = isWithin(
          artBoardState.currentArtBoard.container(),
          event as MouseEvent
        );
        if (_isWithin.result !== artBoardState.cursorWithinArtboard) {
          dispatchOnArtBoard({
            type: "cursorWithinArtboard",
            value: {
              isWithin: _isWithin.result,
              leftBoundsLTRB: _isWithin.bounds,
              lastX: _isWithin.lastX,
              lastY: _isWithin.lastY,
            },
          });
        }
      }
    }
  };

  const handleDeleteWork = useCallback(() => {
    if (!notificationsState.modalVisible) {
      dispatchOnNotifications({
        type: "initModal",
        value: {
          message: "Are you sure you want to delete this work?",
          confirmModalAction: () => {
            dispatchOnNotifications({
              type: "killModal",
            });
            dispatchOnArtBoard({
              type: "nukeEverything",
            });
            dispatchOnWizard({
              type: "newWizardInstance",
            });
          },
        } as ModalConfiguration,
      });
    }
  }, [
    notificationsState.modalVisible,
    dispatchOnNotifications,
    dispatchOnWizard,
    dispatchOnArtBoard,
  ]);

  const renderWizardRoutes = () => {
    if (hasPaintOptions) {
      return (
        <>
          <div className="uk-flex uk-margin-left uk-flex-bottom top-tool-bar">
            {showToolBar() && (
              <div className="uk-flex-1">
                <div className="uk-flex wizard-toolbar-container">
                  <ConfigurationToolBar />
                </div>
              </div>
            )}
            <WizardNavigation />
          </div>
          <div className="uk-margin-left uk-flex">
            {showToolBar() && <ArtboardToolBar />}
            {WizardRoutes}
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="uk-flex uk-margin-left top-tool-bar">
            {showToolBar() && (
              <div className="wizard-toolbar-container">
                <ArtboardToolBar />
              </div>
            )}
            <WizardNavigation />
          </div>
          <div className="uk-margin-left uk-flex">{WizardRoutes}</div>
        </>
      );
    }
  };

  return (
    <div className="uk-flex ec-wizard" onMouseMove={handleMouseMove}>
      <div className="uk-width-medium wizard-steps-nav-container">
        <ul className="uk-list">
          {Object.values(wizardState.steps).map(
            (stepDef: WizardStepDefinition) => {
              return (
                <li
                  key={"step-" + stepDef.order}
                  className={stepIsActive(stepDef) ? "uk uk-step-active" : "uk"}
                >
                  <Link
                    className={
                      canNavigateToNextStep(stepDef)
                        ? "uk-link"
                        : "uk-link-muted uk-disabled"
                    }
                    to={WIZARD_BASE.route + stepDef.route}
                    onClick={() => {
                      dispatchOnWizard({
                        type: "setStep",
                        value: stepDef,
                      });
                    }}
                  >
                    {stepHasBeenFinalized(stepDef) ? (
                      <svg
                        className="uk-margin-small-right"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        width="16"
                      >
                        <path
                          fill="green"
                          d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="uk-margin-small-right"
                        width="16"
                        fill="grey"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z" />
                      </svg>
                    )}
                    {stepDef.title}
                  </Link>
                </li>
              );
            }
          )}
        </ul>
        <div className="uk-button-bar rounded-ends">
          <button
            className="uk-button uk-button-default uk-button-small uk-button-icon uk-margin"
            onClick={handleAddPanel}
          >
            Add Panel
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
              <path d="M368 224H224V80c0-8.84-7.16-16-16-16h-32c-8.84 0-16 7.16-16 16v144H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h144v144c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16V288h144c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16z" />
            </svg>
          </button>
        </div>
        <button
          className="uk-button uk-button-default"
          onClick={handleDeleteWork}
        >
          Start Over
        </button>
      </div>
      <div className="uk-block">
        <h3 className="uk-card-title uk-margin-left">
          {wizardState.currentStep.title}
        </h3>
        {renderWizardRoutes()}
      </div>
    </div>
  );
};

export default Wizard;
