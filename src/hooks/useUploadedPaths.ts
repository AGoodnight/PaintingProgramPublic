import mockPaths from "../mockData/mockPaths";
import { Shape } from "../models/artboard.models";

const useUploadedPaths = () => {
  const execute = () => {
    return {
      status: 200,
      // body: mockPaths as Partial<Shape>[],
      body: [],
    };
  };

  return {
    execute,
  };
};
export default useUploadedPaths;
