export type NotificationsState = {
  modalMessage: string;
  modalVisible: boolean;
  currentModalType: ModalType | null;
  currentModalConfirmAction: () => void;
  currentModalDenyAction: () => void;
};

export type ModalType = "confirm";

export type ModalConfiguration = {
  message: string;
  confirmModalAction: () => void;
  denyModalAction: () => void;
  modalType: ModalType;
};

export type NotificationsValueType = ModalConfiguration;
export type NotificationsAction = {
  type: NotificationsActionTypes;
  value?: NotificationsValueType;
};

export type NotificationsActionTypes = "killModal" | "initModal";

export type NotificationsDispatch = (action: NotificationsAction) => void;
export type NotificationsRedux = {
  state: NotificationsState;
  dispatch: NotificationsDispatch;
};
