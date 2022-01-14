import { createContext, useContext, useEffect, useReducer } from "react";
import { ART_BOARD_INITIAL_CONTEXT } from "../constants/artboard.contants";
import { CursorWithinElementRelationship } from "../cursor.context";
import {
  ArtBoardRedux,
  ArtBoardState,
  Shape,
  ArtBoardActionTypes,
  ArtBoardValueType,
  PanelAndShapes,
  PanelConfiguration,
} from "../models/artboard.models";

const artBoardReducer = (
  state: ArtBoardState,
  action: {
    type: ArtBoardActionTypes;
    value: ArtBoardValueType;
  }
) => {
  let _state = { ...state };
  let shapesForPanelByMediumFromState = [] as Shape[];
  let allOtherFinalizedShapesFromState = [] as Shape[];
  switch (action.type) {
    case "setId": {
      if (typeof action.value === "string") {
        return Object.assign({}, _state, {
          id: action.value,
        });
      } else {
        return _state;
      }
    }
    case "setShapes":
      return Object.assign({}, _state, {
        shapes: action.value as Shape[],
      });
    case "setMediumType":
      return Object.assign({}, _state, {
        mediumType: action.value,
      });
    case "startRemoveFromShapes":
      return Object.assign({}, _state, {
        drawing: true,
        shapes: [],
      });
    case "startCurrentShape":
      return Object.assign({}, _state, {
        drawing: true,
        currentShape: action.value as Shape,
      });
    case "endRemoveFromShapes":
      return Object.assign({}, _state, {
        drawing: false,
        shapes: action.value as Shape[],
        currentShape: {} as Shape,
      });
    case "endCurrentShape":
      return Object.assign({}, _state, {
        drawing: false,
        shapes: _state.shapes.concat([action.value as Shape]),
        currentShape: {} as Shape,
      });
    case "toggleDrawing":
      return Object.assign({}, _state, {
        drawing: !state.drawing,
      });
    case "endDrawing":
      return Object.assign({}, _state, {
        drawing: false,
      });
    case "startDrawing":
      return Object.assign({}, _state, {
        drawing: true,
      });
    case "removeLastShape":
      if (typeof action.value === "object") {
        if (action.value.hasOwnProperty("key")) {
          const _value = action.value as PanelConfiguration;
          shapesForPanelByMediumFromState = _state.shapes.filter((shape) => {
            return shape.type.key === _value.key;
          });
          let allOtherShapesFromState = _state.shapes.filter((shape) => {
            return shape.type.key !== _value.key;
          });
          let _shapes = shapesForPanelByMediumFromState;
          if (_shapes.length > 0) {
            _shapes.pop();
          }
          console.log(allOtherShapesFromState, _shapes);
          return Object.assign({}, _state, {
            shapes: [..._shapes, ...allOtherShapesFromState],
          });
        }
      }
      return _state;
    case "setPayload":
      return Object.assign({}, _state, {
        asPayload: action.value,
      });
    case "cancelLastChange":
      return Object.assign({}, _state, {
        canceling: true,
      });
    case "cursorWithinArtboard":
      if (action.value.hasOwnProperty("isWithin")) {
        const value = action.value as CursorWithinElementRelationship;
        let rest: Record<string, any> = {};
        if (_state.cursorWithinArtboard) {
          if (!value.isWithin) {
            rest = {
              cursorLeftArtBoardAt: [value.lastX, value.lastY],
            };
          }
        } else {
          if (value.isWithin) {
            rest = {
              cursorEnteredArtBoardAt: [value.lastX, value.lastY],
            };
          }
        }
        return Object.assign({}, _state, {
          cursorWithinArtboard: value.isWithin,
          cursorLeftBoundsLTRB: value.leftBoundsLTRB,
          ...rest,
        });
      } else {
        return _state;
      }
    case "endCancelEvent":
      return Object.assign({}, _state, {
        canceling: false,
      });

    case "setFinalizedShapes":
      if (Object.keys(action.value).indexOf("medium") > -1) {
        let _value = action.value as PanelAndShapes;
        console.log(_state.finalizedShapes, action);
        allOtherFinalizedShapesFromState = _state.finalizedShapes.filter(
          (shape) => {
            return shape.type.key !== _value.medium.key;
          }
        );
        return Object.assign({}, _state, {
          finalizedShapes: [
            ...allOtherFinalizedShapesFromState,
            ..._value.shapes,
          ],
        });
      }
      return _state;
    // }
    case "finalizeShapesForPanelByMedium":
      shapesForPanelByMediumFromState = _state.shapes.filter((shape) => {
        return shape.type.key === action.value;
      });
      allOtherFinalizedShapesFromState = _state.finalizedShapes.filter(
        (shape) => {
          return shape.type.key !== action.value;
        }
      );
      return Object.assign({}, _state, {
        finalizedShapes: [
          ...shapesForPanelByMediumFromState,
          ...allOtherFinalizedShapesFromState,
        ],
      });
    case "stageRendered":
      return Object.assign({}, _state, {
        currentArtBoard: action.value,
      });
    case "finalizeAllShapes":
      return _state;
    case "nukeAllShapes":
      return Object.assign({}, _state, { shapes: [] });
    case "nukeAllShapesForPanelByMedium":
      const _value = action.value as PanelConfiguration;
      return Object.assign({}, _state, {
        shapes: _state.shapes.filter((shape) => {
          return shape.type.key !== _value.key;
        }),
      });

    case "nukeEverything":
      return ART_BOARD_INITIAL_CONTEXT;
    default:
      return state;
  }
};

const getLocalArtBoardState = () => {
  const localState = localStorage.getItem("artBoardState");
  return localState ? JSON.parse(localState) : ART_BOARD_INITIAL_CONTEXT;
};

export const ArtBoardContext = createContext<ArtBoardRedux>(
  getLocalArtBoardState() as ArtBoardRedux
);

export const ArtBoardProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(
    artBoardReducer,
    getLocalArtBoardState()
  );
  const value = { state, dispatch };

  useEffect(() => {
    localStorage.setItem("artBoardState", JSON.stringify(state));
  }, [state]);

  return (
    <ArtBoardContext.Provider value={value as ArtBoardRedux}>
      {children}
    </ArtBoardContext.Provider>
  );
};

export const useArtBoardContext = () => {
  const context = useContext(ArtBoardContext);
  if (context === undefined) {
    throw new Error(
      "useArtBoardContext must be used within a ArtBoardProvider"
    );
  }
  return context;
};
