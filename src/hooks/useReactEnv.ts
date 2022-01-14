const useReactEnv = () => {
  const usePaintOptions = process.env.REACT_APP_USE_COLORPICKER === "true";
  return {
    usePaintOptions,
  };
};

export default useReactEnv;
