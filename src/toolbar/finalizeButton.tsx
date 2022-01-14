import React, { useCallback, useEffect, useState } from "react";
import ArtBoard from "../artboard/artboard";
import { useArtBoardContext } from "../artboard/artboard.context";
import { ModalConfiguration } from "../models/notifications.models";
import { useNotificationsContext } from "../notifications/notifications.context";
import { useWizardContext } from "../wizard/wizard.context";

export const FinalizeButton: React.FC = () => {
  const { state: wizardState, dispatch: dispatchOnWizard } = useWizardContext();
  const { dispatch: dispatchOnNotifications } = useNotificationsContext();
  const { state: artBoardState, dispatch: dispatchOnArtBoard } =
    useArtBoardContext();

  const [doneProps, setDoneProps] = useState<
    Record<string, number | string | boolean>
  >({});

  const [doneLabels, setDoneLabels] = useState<string[]>(
    wizardState.currentStep.keyStone
      ? ["Finalize", "Reset"]
      : ["Finalize", "Update"]
  );

  const updateState = useCallback(() => {
    const createDoneProps = () => {
      return {
        disabled: false,
        value: wizardState.currentStep.complete,
      };
    };
    setDoneProps(createDoneProps());
    setDoneLabels(
      wizardState.currentStep.keyStone
        ? ["Finalize", "Reset"]
        : ["Finalize", "Update"]
    );
  }, [wizardState.currentStep]);

  const handleFinalizeStep = () => {
    if (wizardState.currentStep.keyStone) {
      if (wizardState.id) {
        dispatchOnNotifications({
          type: "initModal",
          value: {
            message:
              "You have already started a property, starting a new property will delete the already started property.",
            confirmModalAction: () => {
              dispatchOnWizard({
                type: "newWizardInstance",
                value: Math.round(Math.random() * 1000).toString(),
              });
              dispatchOnArtBoard({
                type: "nukeEverything",
              });
              dispatchOnNotifications({
                type: "killModal",
              });
              dispatchOnWizard({
                type: "finalizeStep",
              });
            },
          } as ModalConfiguration,
        });
      } else {
        dispatchOnWizard({
          type: "newWizardInstance",
          value: Math.round(Math.random() * 1000).toString(),
        });
        dispatchOnWizard({
          type: "finalizeStep",
        });
      }
    } else {
      dispatchOnWizard({
        type: "finalizeStep",
      });
    }

    if (wizardState.currentStep.component === ArtBoard) {
      dispatchOnArtBoard({
        type: "finalizeShapesForPanelByMedium",
        value: artBoardState.mediumType,
      });
    }
  };

  useEffect(() => {
    updateState();
  }, [wizardState, updateState]);

  return (
    <button
      className="uk-button uk-button-default uk-button-small"
      uk-button
      onClick={handleFinalizeStep}
      {...doneProps}
    >
      {doneProps.value === true ? doneLabels[1] : doneLabels[0]}
    </button>
  );
};
