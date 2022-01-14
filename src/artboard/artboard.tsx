import React, { Ref, useCallback, useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Stage, Layer, Line, Circle } from "react-konva";
import { useArtBoardContext } from "./artboard.context";
import { useToolBarContext } from "../toolbar/toolbar.context";
import {
  Point,
  Shape,
  RectSize,
  Position,
  PanelConfiguration,
} from "../models/artboard.models";
import { ToolBarTool, ArtBoardTool } from "../models/toolbar.models";
import { APIShape } from "../models/api.model";
import useShapes from "../hooks/useShapes";
import { KonvaEventObject } from "konva/lib/Node";
import useCursorPosition from "../hooks/useCursorPosition";
import { DEFINED_ACTIVE_DRAWING_CONFIG } from "../constants/artboard.contants";
import { PaintConfiguration } from "../models/toolTypes.models";

type ArtBoardProps = {
  medium: PanelConfiguration;
  isFinalized: boolean;
};

const ArtBoard: React.FC<ArtBoardProps> = ({
  medium,
  isFinalized,
  ...props
}) => {
  const setDblClickMaybe = useRef<boolean>(false);
  const { state: artBoardState, dispatch: dispatchOnArtBoard } =
    useArtBoardContext();
  const { state: toolBarState } = useToolBarContext();
  const [currentShape, setCurrentShape] = useState<Shape>({} as Shape);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [pointMarkers, setPointMarkers] = useState<Point[]>([]);
  const [cursorHasEntered, setCursorHasEntered] = useState<boolean>(false);
  const stageRef: Ref<Konva.Stage> = React.useRef(null);
  const [artBoardDimensions] = useState<RectSize>(artBoardState.canvasSize);

  const {
    addToFreehandShape,
    createNewCurrentShape,
    beginEraseFromShapes,
    eraseFromShapes,
    drawLineTo,
    createDrawnLine,
  } = useShapes(toolBarState, artBoardState);
  const { getStagePosition } = useCursorPosition();

  // Artboard prep
  // -------------------
  const drawShapesFromStorage = useCallback(() => {
    setShapes(
      artBoardState.shapes.filter((shape) => {
        return shape.type.key === medium.key;
      })
    );
  }, [artBoardState.shapes, medium]);

  // Start Drawing or Erasing
  // -----------------------------
  const startNewPolygon = (cursorPosition: Position) => {
    if (!toolBarState.tool.paint) {
      return;
    }
    dispatchOnArtBoard({ type: "startDrawing" });
    setCurrentShape(
      createNewCurrentShape(
        cursorPosition,
        toolBarState.tool.paint,
        toolBarState.tool.paint.fillColor
      )
    );
  };

  const startNewFreehand = (cursorPosition: Position) => {
    if (!toolBarState.tool.paint) {
      return;
    }
    dispatchOnArtBoard({ type: "startDrawing" });
    setCurrentShape(
      createNewCurrentShape(
        cursorPosition,
        toolBarState.tool.paint,
        toolBarState.tool.paint.fillColor
      )
    );
  };

  const startNewPaintBrush = (cursorPosition: Position) => {
    if (!toolBarState.tool.paint) {
      return;
    }
    dispatchOnArtBoard({ type: "startDrawing" });
    setCurrentShape(
      createNewCurrentShape(
        cursorPosition,
        toolBarState.tool.paint,
        toolBarState.tool.paint.strokeColor
      )
    );
  };

  const startEraseShapes = (cursorPosition: Position) => {
    if (!toolBarState.tool.paint) {
      return;
    }
    if (!shapes) {
      return;
    }
    dispatchOnArtBoard({ type: "startDrawing" });
    setShapes(
      beginEraseFromShapes(
        cursorPosition,
        toolBarState.tool.paint,
        shapes,
        toolBarState.tool.paint.fillColor
      )
    );
  };

  // Continue the drawn shape or eraser
  // ----------------------------------------
  const drawFreehandShape = (cursorPosition: Position) => {
    setCurrentShape(addToFreehandShape(cursorPosition, currentShape));
  };

  const eraseShapes = (cursorPosition: Position) => {
    setShapes(eraseFromShapes(cursorPosition, shapes));
  };

  const drawPolygonSide = (cursorPosition: Position) => {
    setCurrentShape(createDrawnLine(cursorPosition, shapes, currentShape));
  };

  const renderLineGuide = (cursorPosition: Position) => {
    setCurrentShape(drawLineTo(cursorPosition, currentShape));
  };

  // End the drawn shape or eraser
  // -------------------------------
  const endShape = (canceling: boolean = false) => {
    if (!canceling) {
      dispatchOnArtBoard({
        type: "endCurrentShape",
        value: currentShape as Shape,
      });
    }
    setCurrentShape({} as Shape);
  };

  const endEraseShape = (canceling: boolean = false) => {
    if (!canceling) {
      dispatchOnArtBoard({
        type: "endRemoveFromShapes",
        value: shapes,
      });
    }
  };

  // UI extras
  // ---------------
  const drawPointMarker = (cursorPosition: Position) => {
    let cPointMarkers = [...pointMarkers];
    cPointMarkers.push([cursorPosition.x, cursorPosition.y]);
    setPointMarkers(cPointMarkers);
  };

  // Mouse Events
  // ------------------
  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const cursorPosition = getStagePosition(e);
    if (!cursorPosition) {
      return;
    }
    if (artBoardState.drawing && toolBarState.tool.key !== "polygon") {
      return;
    }
    switch (toolBarState.tool.key as ArtBoardTool | ToolBarTool) {
      case "eraser":
        if (artBoardState.drawing) {
          return;
        }
        startEraseShapes(cursorPosition);
        break;
      case "freehand":
        if (artBoardState.drawing) {
          return;
        }
        startNewFreehand(cursorPosition);
        break;
      case "paintbrush":
        if (artBoardState.drawing) {
          return;
        }
        startNewPaintBrush(cursorPosition);
        break;
      case "polygon":
        if (!artBoardState.drawing) {
          startNewPolygon(cursorPosition);
          drawPointMarker(cursorPosition);
        } else {
          if (setDblClickMaybe.current) {
            setPointMarkers([]);
            endShape();
          } else {
            drawPointMarker(cursorPosition);
            drawPolygonSide(cursorPosition);
            setDblClickMaybe.current = true;
            setTimeout(() => {
              setDblClickMaybe.current = false;
            }, 300);
          }
        }
        break;
      case "undo":
        break;
      default:
        break;
    }
  };

  const getActiveDrawingConfiguration = (): PaintConfiguration => {
    switch (toolBarState.tool.key) {
      case "paintbrush":
        return {
          strokeColor: "#" + toolBarState.tool.paint?.strokeColor,
          fillColor: "#" + toolBarState.tool.paint?.fillColor,
          strokeWidth: toolBarState.tool.paint?.strokeWidth,
          tension: toolBarState.tool.paint?.tension,
          closed: toolBarState.tool.paint?.closed,
        } as PaintConfiguration;
      default:
        return DEFINED_ACTIVE_DRAWING_CONFIG;
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    const cursorPosition = getStagePosition(e);
    if (!cursorPosition) {
      return;
    }
    if (!artBoardState.drawing) {
      return;
    }
    switch (toolBarState.tool.key as ArtBoardTool) {
      case "eraser":
        eraseShapes(cursorPosition);
        break;
      case "freehand":
        drawFreehandShape(cursorPosition);
        break;
      case "paintbrush":
        drawFreehandShape(cursorPosition);
        break;
      case "polygon":
        renderLineGuide(cursorPosition);
        break;
      default:
        break;
    }
  };

  const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    if (!artBoardState.drawing) {
      return;
    }
    switch (toolBarState.tool.key as ArtBoardTool) {
      case "eraser":
        endEraseShape();
        producePayload();
        break;
      case "freehand":
        endShape();
        producePayload();
        break;
      case "paintbrush":
        endShape();
        producePayload();
        break;
      case "polygon":
        break;
    }
  };

  // Data
  // ------------
  const producePayload = () => {
    stageRef.current?.toCanvas().toBlob(async (blob) => {
      // Capture Blobs
      if (blob) {
        dispatchOnArtBoard({
          type: "setPayload",
          value: {
            id: artBoardState.id,
            areaType: "blha",
            drawnImage: blob,
            shapes: [...shapes, currentShape].map((shape) => {
              return {
                tool: shape.tool,
                points: shape.points,
              } as APIShape;
            }),
          },
        });
      }
    }, "image/jpg");
  };

  // Lifecycle Events
  // -----------------------
  useEffect(() => {
    if (stageRef.current) {
      dispatchOnArtBoard({
        type: "stageRendered",
        value: stageRef.current,
      });
    }
  }, [stageRef, dispatchOnArtBoard]);

  useEffect(() => {
    // Use the last x and y of the mouse from the mousemove event
    // instead of konva to get more accurate final pixel at edges of artboard
    if (stageRef.current) {
      const fromLeft = artBoardState.cursorLeftBoundsLTRB[0];
      const fromTop = artBoardState.cursorLeftBoundsLTRB[1];
      const fromRight = artBoardState.cursorLeftBoundsLTRB[2];
      const fromBottom = artBoardState.cursorLeftBoundsLTRB[3];

      const exit = artBoardState.cursorLeftArtBoardAt;
      const enter = artBoardState.cursorEnteredArtBoardAt;

      const _method =
        currentShape.tool === "freehand" ? addToFreehandShape : () => {};

      if (fromLeft || fromTop || fromRight || fromBottom) {
        _method(
          {
            x:
              exit[0] - stageRef.current?.container().getBoundingClientRect().x,
            y:
              exit[1] - stageRef.current?.container().getBoundingClientRect().y,
          },
          currentShape
        );
        setCursorHasEntered(false);
      } else {
        if (!cursorHasEntered) {
          console.log(enter);
          _method(
            {
              x:
                enter[0] -
                stageRef.current?.container().getBoundingClientRect().x,
              y:
                enter[1] -
                stageRef.current?.container().getBoundingClientRect().y,
            },
            currentShape
          );
          setCursorHasEntered(true);
        }
      }
    }
  }, [
    artBoardState.cursorWithinArtboard,
    artBoardState.cursorEnteredArtBoardAt,
    artBoardState.cursorLeftArtBoardAt,
    artBoardState.cursorLeftBoundsLTRB,
    addToFreehandShape,
    currentShape,
    cursorHasEntered,
  ]);

  useEffect(() => {
    if (!artBoardState.drawing && medium) {
      drawShapesFromStorage();
    }
  }, [
    artBoardState.drawing,
    drawShapesFromStorage,
    medium,
    dispatchOnArtBoard,
  ]);

  useEffect(() => {
    console.log("shapes");
  }, [artBoardState.shapes]);

  // JSX Markup
  // ---------------
  return (
    <div className="ec-stage">
      <Stage
        width={artBoardDimensions.width}
        height={artBoardDimensions.height}
        ref={stageRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {shapes.map((shape, i) => (
            <>
              <Line
                key={i}
                points={[...shape.pointsAsFlatArray]}
                lineCap="round"
                fill={shape.fillColor}
                stroke={shape.strokeColor}
                strokeWidth={shape.strokeWidth}
                closed={shape.closed}
                tension={shape.tension ?? 0}
                globalCompositeOperation={
                  shape.tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            </>
          ))}
          {currentShape && (
            <Line
              key={"cs_1"}
              points={currentShape.pointsAsFlatArray}
              stroke={getActiveDrawingConfiguration().strokeColor}
              tension={currentShape.tension ?? 0}
              strokeWidth={getActiveDrawingConfiguration().strokeWidth}
              lineCap="round"
            />
          )}
          {pointMarkers.length > 0 &&
            pointMarkers.map((marker, i) => (
              <Circle
                width={10}
                height={10}
                fill={DEFINED_ACTIVE_DRAWING_CONFIG.fillColor}
                stroke={DEFINED_ACTIVE_DRAWING_CONFIG.strokeColor}
                strokeWidth={1}
                x={marker[0]}
                y={marker[1]}
                key={"marker" + i}
              />
            ))}
        </Layer>
      </Stage>
    </div>
  );
};
export default ArtBoard;
