import { useEffect, useState } from "react";

export const useInput = (initialValue: string | number | undefined) => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setValue,
    reset: () => setValue(initialValue),
    bind: {
      value,
      onChange: (event: any) => {
        setValue(event.target.value);
      },
    },
  };
};

export const isHex = (value: string) => {
  return value.length === 3 || value.length === 6;
};

export const hexToAlphaNumeric = (value: string) => {
  return value.replace(/[\W]/, "");
};

export const useColor = (initialValue: string = "000") => {
  const [inputValue, setValue] = useState(
    isHex(initialValue) ? initialValue : "000"
  );
  const [value, setFinalValue] = useState(
    isHex(initialValue) ? initialValue : "000"
  );

  useEffect(() => {
    setFinalValue(inputValue.replace(/[\W]/, ""));
  }, [inputValue]);

  return {
    value,
    setValue,
    reset: () => setValue(initialValue),
    bind: {
      value,
      onChange: (event: any) => {
        const _value = event.target.value.replace(/[\W]/, "");
        console.log(_value);
        setValue(_value);
      },
    },
  };
};

export const useNumber = (
  initialValue: number | undefined,
  negative: boolean = true,
  max: number
) => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setValue,
    reset: () => setValue(undefined),
    bind: {
      value,
      onChange: (event: any) => {
        if (max) {
          if (parseFloat(event.target.value) > max) {
            return;
          }
        }
        if (!negative) {
          if (parseFloat(event.target.value)! > -1 || !event.target.value) {
            setValue(parseFloat(event.target.value));
          }
        } else {
          setValue(parseFloat(event.target.value));
        }
      },
    },
  };
};

export const useString = (initialValue: string = "") => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setValue,
    reset: () => setValue(initialValue),
    bind: {
      value,
      onChange: (event: any) => {
        setValue(event.target.value);
      },
    },
  };
};
