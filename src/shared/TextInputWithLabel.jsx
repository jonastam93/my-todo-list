import { forwardRef } from "react";

const TextInputWithLabel = forwardRef(function TextInputWithLabel(
  {
    elementId,
    labelText,
    onChange,
    value,
    maxLength,
  },
  ref
) {
  return (
    <>
      <label htmlFor={elementId}>{labelText}</label>
      <input
        type="text"
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
      />
    </>
  );
});

export default TextInputWithLabel;