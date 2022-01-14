import React, { useEffect, useState, HTMLAttributes } from "react";
import { useNotificationsContext } from "./notifications.context";

const ConfirmModal: React.FC = ({ children }) => {
  const [modalProps, setModalProps] =
    useState<HTMLAttributes<HTMLDivElement>>();
  const { state, dispatch } = useNotificationsContext();
  const handleClick = () => {
    state.currentModalConfirmAction();
  };
  const handleClose = () => {
    dispatch({
      type: "killModal",
    });
  };

  useEffect(() => {
    if (state.modalVisible) {
      setModalProps({
        className: "uk-modal uk-open",
      });
    } else {
      setModalProps({
        className: "uk-modal",
      });
    }
  }, [state.modalVisible]);
  return (
    <>
      <div {...modalProps}>
        <div className="uk-modal-dialog uk-modal-body">
          <h2 className="uk-modal-title">Confirm this Action.</h2>
          <p>{state.modalMessage}</p>
          <button
            className="uk-button uk-button-primary uk-margin-right"
            onClick={handleClick}
          >
            Confirm
          </button>
          <button className="uk-button uk-button-default" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
