import { useRef } from "react";

type SwatchProps = React.HTMLAttributes<HTMLDivElement> & {
  color: string;
  variant?: "square" | "stroke" | "circle";
};

const Swatch = ({ color, variant, onClick, ...rest }: SwatchProps) => {
  const swatchRef = useRef<HTMLDivElement | null>(null);
  const hex = color.indexOf("#") > -1 ? color : "#" + color;

  const getClassName = () => {
    switch (variant) {
      case "circle":
        return "circle-swatch";
      case "square":
        return "square-swatch";
      case "stroke":
        return "stroke-swatch";
      default:
        return "square-swatch";
    }
  };

  const getStyle = () => {
    switch (variant) {
      case "circle":
        return { backgroundColor: hex };
      case "square":
        return { backgroundColor: hex };
      case "stroke":
        return {
          backgroundColor: "none",
          border: "#" + color + " 2px solid",
          width: "26px",
          height: "26px",
        };
      default:
        return { backgroundColor: hex };
    }
  };

  return (
    <div
      onClick={onClick}
      ref={swatchRef}
      style={getStyle()}
      className={getClassName()}
    ></div>
  );
};
export default Swatch;
