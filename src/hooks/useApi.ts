import { StepAPIPayload } from "../models/api.model";
import { PanelKey } from "../models/artboard.models";

const MOCK_EMPTY: Partial<StepAPIPayload> = {
  id: undefined,
};

const MOCK: Partial<Record<PanelKey, StepAPIPayload>> = {
  title: {
    id: "0",
    shapes: [],
    areaType: "title",
    drawnImage: new Blob(),
  },
};

const useApi = () => {
  const getAllSteps = (
    id: string
  ): Partial<Record<PanelKey, StepAPIPayload>> => {
    return MOCK;
  };
  const getSavedStep = (
    id: string,
    medium: PanelKey
  ): Partial<StepAPIPayload> => {
    return Object.assign({}, MOCK[medium] || MOCK_EMPTY, {
      id,
    });
  };
  const patchSavedStep = (
    id: number,
    medium: PanelKey
  ): Partial<StepAPIPayload> => {
    return Object.assign({}, MOCK[medium] || MOCK_EMPTY, {
      id,
    });
  };
  const createSavedStep = (
    id: number,
    medium: PanelKey
  ): Partial<StepAPIPayload> => {
    return Object.assign({}, MOCK[medium] || MOCK_EMPTY, {
      id,
    });
  };
  return { getSavedStep, patchSavedStep, createSavedStep };
};

export default useApi;
