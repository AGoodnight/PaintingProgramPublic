import { DEFINED_PANEL_TYPES } from "../constants/artboard.contants";
import {
  ArtBoardState,
  Position,
  PanelKey,
  Shape,
} from "../models/artboard.models";
import { ToolBarState, ArtBoardTool } from "../models/toolbar.models";
import { PaintConfiguration } from "../models/toolTypes.models";

const useShapes = (
  toolBarState: ToolBarState,
  artBoardState: ArtBoardState
) => {
  // const [stateShapesKey, setStateShapesKey] = useState<keyof ArtBoardState>(
  //   isFinalized ? "finalizedShapes" : "shapes"
  // );

  // useEffect(() => {
  // const getShapesState = () => {
  //   const shapeLengthDiffers =
  //     artBoardState.finalizedShapes.length !== artBoardState.shapes.length;
  //   const aShapeDiffers: boolean = artBoardState.finalizedShapes.some(
  //     (shape: Shape, index: number) => {
  //       //check the first, second, middle and last point of the shapes point values.
  //       return (
  //         shape.pointsAsFlatArray[0] !==
  //           artBoardState.shapes[index].pointsAsFlatArray[0] ||
  //         shape.pointsAsFlatArray[1] !==
  //           artBoardState.shapes[index].pointsAsFlatArray[1] ||
  //         shape.pointsAsFlatArray[
  //           Math.round(shape.pointsAsFlatArray.length / 2) - 1
  //         ] !==
  //           artBoardState.shapes[index].pointsAsFlatArray[
  //             Math.round(shape.pointsAsFlatArray.length / 2) - 1
  //           ] ||
  //         shape.pointsAsFlatArray[shape.pointsAsFlatArray.length - 1] !==
  //           artBoardState.shapes[index].pointsAsFlatArray[
  //             shape.pointsAsFlatArray.length - 1
  //           ]
  //       );
  //     }
  //   );
  // if (aShapeDiffers && shapeLengthDiffers) {
  // setStateShapesKey("shapes");
  // return "shapes";
  // } else {
  //   return stateShapesKey;
  // }
  // };
  // if (!artBoardState.drawing && medium) {
  // switch (getShapesState()) {
  //   case "finalizedShapes":
  //     setShapes(
  //       artBoardState.finalizedShapes.filter((shape) => {
  //         return shape.type.apiPanelByMediumKey === medium;
  //       })
  //     );
  //     break;
  //   default:
  // setShapes(
  //   artBoardState.shapes.filter((shape) => {
  //     return shape.type.apiPanelByMediumKey === medium;
  //   })
  // );
  // break;
  // }
  // }
  // }, [artBoardState.shapes, artBoardState.drawing, medium]);

  // const canDraw = (e: KonvaEventObject<MouseEvent>): boolean => {
  //   return !artBoardState.drawing && !getCursorStagePosition(e);
  // };

  const createDrawnLine = (
    cursorPosition: Position,
    lastShapes: Shape[],
    currentShape: Shape
  ): Shape => {
    let _currentPoints = currentShape.points;
    // prevent bad rendering

    let _currentPointsAsFlatArray = _currentPoints.flat();
    _currentPoints.push([cursorPosition.x, cursorPosition.y]);
    _currentPointsAsFlatArray.push(cursorPosition.x, cursorPosition.y);
    return Object.assign({}, currentShape, {
      points: _currentPoints,
      pointsAsFlatArray: _currentPointsAsFlatArray,
    });
  };

  const createNewCurrentShape = (
    cursorPosition: Position,
    paint: PaintConfiguration,
    color: string
  ): Shape => {
    return {
      tool: toolBarState.tool.key as ArtBoardTool,
      strokeWidth: paint.strokeWidth,
      strokeColor: "#" + paint.strokeColor,
      closed: paint.closed,
      pointsAsFlatArray: [cursorPosition.x, cursorPosition.y],
      points: [[cursorPosition.x, cursorPosition.y]],
      tension: paint.tension || 0,
      fillColor: "#" + color,
      type: artBoardState.mediumType
        ? artBoardState.mediumType
        : DEFINED_PANEL_TYPES.title,
    };
  };

  const beginEraseFromShapes = (
    cursorPosition: Position,
    paint: PaintConfiguration,
    lastShapes: Shape[],
    color: string
  ): Shape[] => {
    return [
      ...lastShapes,
      {
        tool: toolBarState.tool.key as ArtBoardTool,
        strokeWidth: paint.strokeWidth,
        strokeColor: "#" + paint.strokeColor,
        closed: paint.closed,
        pointsAsFlatArray: [cursorPosition.x, cursorPosition.y],
        points: [[cursorPosition.x, cursorPosition.y]],
        tension: paint.tension || 0,
        fillColor: "#" + color,
        type: artBoardState.mediumType
          ? artBoardState.mediumType
          : DEFINED_PANEL_TYPES.title,
      },
    ];
  };

  const eraseFromShapes = (
    cursorPosition: Position,
    lastShapes: Shape[]
  ): Shape[] => {
    const _currentShapes = [...lastShapes];
    let _currentShape = lastShapes[lastShapes.length - 1];
    // prevent bad rendering
    if (
      Math.abs(
        cursorPosition.x -
          _currentShape.points[_currentShape.points.length - 1][0]
      ) > 1 ||
      Math.abs(
        cursorPosition.y -
          _currentShape.points[_currentShape.points.length - 1][1]
      ) > 1
    ) {
      let _currentFlattendPoints = _currentShape.pointsAsFlatArray
        ? _currentShape.pointsAsFlatArray
        : [];
      let _currentPoints = _currentShape.points ? _currentShape.points : [];
      _currentPoints.push([cursorPosition.x, cursorPosition.y]);
      _currentFlattendPoints.push(cursorPosition.x, cursorPosition.y);
      let _updatedShape = Object.assign({}, _currentShape, {
        pointsAsFlatArray: _currentFlattendPoints,
        points: _currentPoints,
      });
      _currentShapes.splice(_currentShapes.length - 1, 1, _updatedShape);
      return _currentShapes;
    } else {
      return lastShapes;
    }
  };

  const addToFreehandShape = (point: Position, currentShape: Shape): Shape => {
    let _currentPoints = currentShape.points ? currentShape.points : [];
    if (
      Math.abs(point.x - _currentPoints[_currentPoints.length - 1][0]) > 1 ||
      Math.abs(point.y - _currentPoints[_currentPoints.length - 1][1]) > 1
    ) {
      let _currentFlattendPoints = currentShape.pointsAsFlatArray
        ? currentShape.pointsAsFlatArray
        : [];
      _currentPoints = _currentPoints.concat([[point.x, point.y]]);
      _currentFlattendPoints = _currentFlattendPoints.concat(point.x, point.y);

      return Object.assign({}, currentShape, {
        points: _currentPoints,
        pointsAsFlatArray: _currentFlattendPoints,
      });
    } else {
      return currentShape;
    }
  };

  const drawLineTo = (cursorPosition: Position, currentShape: Shape): Shape => {
    let _currentPoints =
      currentShape.points.length > 1
        ? currentShape.points.slice(0, currentShape.points.length - 1)
        : currentShape.points;
    let _currentPointsAsFlatArray = _currentPoints.flat();
    _currentPoints.push([cursorPosition.x, cursorPosition.y]);
    _currentPointsAsFlatArray.push(cursorPosition.x, cursorPosition.y);
    return Object.assign({}, currentShape, {
      points: _currentPoints,
      pointsAsFlatArray: _currentPointsAsFlatArray,
    });
  };

  return {
    createDrawnLine,
    drawLineTo,
    addToFreehandShape,
    eraseFromShapes,
    beginEraseFromShapes,
    createNewCurrentShape,
  };
};

export default useShapes;
