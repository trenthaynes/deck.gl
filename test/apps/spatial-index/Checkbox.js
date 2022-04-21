import React from 'react';
export default function Checkbox({label, value, onChange}) {
  return (
    <label style={{position: 'relative', padding: 4, margin: 2, width: 200}}>
      <input type="checkbox" checked={value} onChange={onChange} />
      {label}
    </label>
  );
}
