import { KonvaEventObject } from "konva/lib/Node";
import { Position } from "../models/artboard.models";

const useCursorPosition = () => {
  const isWithin = (
    element: Element,
    event: MouseEvent
  ): { result: boolean; bounds: boolean[]; lastX: number; lastY: number } => {
    const elePosition: DOMRect = element.getBoundingClientRect();
    const cursorPosition: number[] = [event.clientX, event.clientY];

    const tooFarRight = cursorPosition[0] > elePosition.x + elePosition.width;
    const tooFarLeft = cursorPosition[0] < elePosition.x;
    const tooFarDown = cursorPosition[1] > elePosition.y + elePosition.height;
    const tooFarUp = cursorPosition[1] < elePosition.y;

    return {
      result: !tooFarRight && !tooFarLeft && !tooFarDown && !tooFarUp,
      bounds: [tooFarLeft, tooFarUp, tooFarRight, tooFarDown],
      lastX: cursorPosition[0],
      lastY: cursorPosition[1],
    };
  };

  const getPosition = (event: MouseEvent): number[] => {
    return [event.clientX, event.clientY];
  };

  const getStagePosition = (
    e: KonvaEventObject<MouseEvent>
  ): Position | null => {
    const stage = e.target.getStage() ?? {
      getPointerPosition: () => {
        return { x: null, y: null };
      },
    };

    // Make the point on the pixel, no weird floats.
    const pos = stage.getPointerPosition();
    const x: number | null | undefined = pos?.x;
    const y: number | null | undefined = pos?.y;

    const xInt: number | null = x ? Math.round(x) : null;
    const yInt: number | null = y ? Math.round(y) : null;

    return xInt && yInt ? { x: xInt, y: yInt } : null;
  };

  return {
    getPosition,
    getStagePosition,
    isWithin,
  };
};

export default useCursorPosition;
