import { useContext, useEffect, useReducer, createContext } from "react";
import { INITIAL_NOTIFICATIONS_STATE } from "../constants/notifications.constants";
import {
  NotificationsAction,
  NotificationsActionTypes,
  NotificationsRedux,
  NotificationsState,
  NotificationsValueType,
} from "../models/notifications.models";

const notificationsReducer = (
  state: NotificationsState,
  action: {
    type: NotificationsActionTypes;
    value: NotificationsValueType;
  }
) => {
  let _state = { ...state };
  console.log(action.value);
  switch (action.type) {
    case "initModal":
      return Object.assign({}, _state, {
        modalMessage: action.value.message,
        modalVisible: true,
        currentModalType: action.value.modalType,
        currentModalConfirmAction: action.value.confirmModalAction,
        currentModalDenyAction: action.value.denyModalAction,
      }) as NotificationsState;
    case "killModal":
      return Object.assign({}, _state, {
        modalMessage: "",
        modalVisible: false,
        currentModalType: null,
        currentModalConfirmAction: () => {},
        currentModalDenyAction: () => {},
      }) as NotificationsState;
  }
};

const getLocalNotificationsState = () => INITIAL_NOTIFICATIONS_STATE;

export const NotificationsContext = createContext<NotificationsRedux>({
  dispatch: (action: NotificationsAction) => {},
  state: INITIAL_NOTIFICATIONS_STATE,
});

export const NotificationsProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(
    notificationsReducer,
    getLocalNotificationsState()
  );
  const value = { state, dispatch };

  return (
    <NotificationsContext.Provider value={value as NotificationsRedux}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsContext = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error(
      "useNotificationsContext must be used within a NotificationsProvider"
    );
  }
  return context;
};
