import { useContext, createContext, useReducer, useEffect } from "react";
import { TOOL_BAR_INITIAL_CONTEXT } from "../constants/toolbar.constants";
import {
  ToolBarAction,
  ToolBarRedux,
  ToolBarState,
  Tool,
} from "../models/toolbar.models";
import { PaintConfiguration } from "../models/toolTypes.models";

const getLocalToolBarState = () => {
  const localState = localStorage.getItem("toolBarState");
  return localState ? JSON.parse(localState) : TOOL_BAR_INITIAL_CONTEXT;
};
const artBoardReducer = (state: ToolBarState, action: ToolBarAction) => {
  const _state = state;
  switch (action.type) {
    case "setTool":
      return Object.assign({}, _state, {
        tool: action.value as Tool,
      });
    case "configureTool":
      const _value = action.value as PaintConfiguration;
      if (
        _value.hasOwnProperty("fillColor") ||
        _value.hasOwnProperty("strokeColor") ||
        _value.hasOwnProperty("strokeWidth")
      ) {
        return Object.assign({}, _state, {
          tool: Object.assign({}, _state.tool, {
            paint: Object.assign({}, _state.tool.paint, {
              fillColor: _value.fillColor || _state.tool.paint?.fillColor,
              strokeColor: _value.strokeColor || _state.tool.paint?.strokeColor,
              strokeWidth: _value.strokeWidth || _state.tool.paint?.strokeWidth,
            } as PaintConfiguration),
          }),
        });
      }
      return _state;
    default:
      return state;
  }
};

export const ToolBarContext = createContext<ToolBarRedux | undefined>(
  getLocalToolBarState()
);

export const ToolBarProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(artBoardReducer, getLocalToolBarState());
  const value = { state, dispatch };

  useEffect(() => {
    localStorage.setItem("toolBarState", JSON.stringify(state));
  }, [state]);

  return (
    <ToolBarContext.Provider value={value}>{children}</ToolBarContext.Provider>
  );
};

export const useToolBarContext = () => {
  const context = useContext(ToolBarContext);
  if (context === undefined) {
    throw new Error("useToolBarContext must be used within a ToolBarProvider");
  }
  return context;
};
