import { NotificationsState } from "../models/notifications.models";

export const INITIAL_NOTIFICATIONS_STATE: NotificationsState = {
  modalMessage: "",
  modalVisible: false,
  currentModalType: null,
  currentModalConfirmAction: () => {},
  currentModalDenyAction: () => {},
};
