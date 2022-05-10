import React, {useState} from 'react';
import DateRangePicker from 'react-daterange-picker';
import Steps from './Steps';


export default function DatePicker({ value, onChange, granularity, steps = [], onSelectStep }) {
  const [open, setOpen] = useState(false)
  const handleSelect = (steps) => {
    onSelectStep(steps)
  }

  return (
    <div style={{ position: 'absolute', background: '#FFF', boxShadow: '#828282 4px 4px 11px 0px', left: '10px', top: '10px', borderRadius: '4px' }}>
      <div style={{ padding: '12px', paddingBottom: '4px', display: "flex" }}>
        <div onClick={() => setOpen(!open)} style={{ cursor: 'pointer' }}>
          <svg height="20px" id="Layer_1" version="1.1" viewBox="0 0 32 32" width="20px"><path d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z"/></svg>
        </div>
        <span style={{ marginLeft: '4px'}}>
          {value.start.format('YYYY/MM/DD')} - {value.end.format('YYYY/MM/DD')} | {granularity && 'Granularity: ' + granularity}
        </span>
      </div>
      {open && <div style={{ maxWidth: '350px', maxHeight: '600px', overflow: 'auto' }}>
        <DateRangePicker firstOfWeek={1}
          numberOfCalendars={2}
          selectionType='range'
          value={value}
          onSelect={onChange} />
        <div>
          <Steps steps={steps} granularity={granularity} onSelect={handleSelect} />
        </div>
      </div>}
    </div>
  );
}
