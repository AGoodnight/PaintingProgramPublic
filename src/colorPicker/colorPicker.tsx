import iro from "@jaames/iro";
import { IroColorPicker } from "@jaames/iro/dist/ColorPicker";
import React, { HTMLAttributes, useEffect, useRef, useState } from "react";
import { DEFAULT_COLOR } from "../constants/toolbar.constants";
import { hexToAlphaNumeric, isHex, useColor } from "../hooks/useInput";
import Swatch from "./swatch";

type ColorPickerPopUpProps = HTMLAttributes<HTMLDivElement> & {
  id: string;
  swatchType: "stroke" | "circle" | "square";
  show?: boolean;
  color?: string;
  onShow?: (show: boolean) => void;
  onColorChange?: (color: string) => void;
};

const ColorPickerPopUp = ({
  id,
  swatchType = "square",
  onColorChange,
  color = DEFAULT_COLOR,
  onShow,
  show = false,
  ...rest
}: ColorPickerPopUpProps) => {
  const iroPickerContainer = useRef<IroColorPicker | null>(null);
  const hexInput = useRef<HTMLInputElement | null>(null);
  const [shown, setShown] = useState<boolean>(show);
  const [popOverClass, setPopOverClass] = useState<string>(
    "uk-card uk-card-default uk-card-body uk-card-pop-over"
  );
  const [currentColor, setCurrentColor] = useState<string>(color);
  const { setValue: setColorValue, bind: colorInputBindedAction } =
    useColor(currentColor);

  const toggleShow = () => {
    setShown(!shown);
    if (onShow) {
      onShow(!shown);
    }
  };

  useEffect(() => {
    setPopOverClass(
      shown
        ? "uk-card uk-card-default uk-card-body uk-card-pop-over show"
        : "uk-card uk-card-default uk-card-body uk-card-pop-over"
    );
  }, [shown]);

  useEffect(() => {
    if (iroPickerContainer.current === null) {
      iroPickerContainer.current = iro.ColorPicker("#" + id, {
        width: 200,
        margin: 10,
        color: currentColor,
      });
      iroPickerContainer.current.on(
        "color:change",
        (color: { hexString: string }) => {
          setCurrentColor(hexToAlphaNumeric(color.hexString));
          if (hexInput.current && hexInput.current) {
            hexInput.current.value = hexToAlphaNumeric(color.hexString);
            setColorValue(hexToAlphaNumeric(color.hexString));
          }
        }
      );
    }
  }, []);

  const setColorFromInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (isHex(input) && iroPickerContainer.current) {
      iroPickerContainer.current.color.set(input);
      setCurrentColor(input);
    }
  };

  const setColorOnEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (iroPickerContainer.current && hexInput.current) {
        if (isHex(hexInput.current.value)) {
          iroPickerContainer.current.color.set(hexInput.current.value);
          setCurrentColor(hexInput.current.value);
        }
      }
    }
  };

  useEffect(() => {
    if (onColorChange) {
      onColorChange(currentColor);
    }
  }, [currentColor, onColorChange]);

  return (
    <div className="color-picker-container">
      <Swatch color={currentColor} onClick={toggleShow} variant={swatchType} />
      <div
        className={popOverClass}
        style={{ border: "#" + currentColor + " solid 2px" }}
      >
        <div id={id}></div>
        <div className="uk-form-stacked uk-margin-small">
          <div className="uk-margin">
            <label className="uk-form-label" data-for="form-stacked-text">
              Hex Value
            </label>
            <div className="uk-form-controls">
              <input
                className="uk-input"
                ref={hexInput}
                id="hexInput"
                type="text"
                onBlur={setColorFromInput}
                onKeyUp={setColorOnEnter}
                {...colorInputBindedAction}
              />
            </div>
          </div>
        </div>
        <button className="uk-button uk-button-default" onClick={toggleShow}>
          Done
        </button>
      </div>
    </div>
  );
};
export default ColorPickerPopUp;
