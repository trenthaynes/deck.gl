import React, {useRef} from 'react';
export default function Querybox({label, value, onChange}) {
  const inputField = useRef();
  return (
    <>
      <input
        style={{position: 'relative', width: 400}}
        ref={inputField}
        type="text"
        defaultValue={value}
      />
      <button style={{position: 'relative'}} onClick={() => onChange(inputField.current.value)}>
        {label}
      </button>
    </>
  );
}
