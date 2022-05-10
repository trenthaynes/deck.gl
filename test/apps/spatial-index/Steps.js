import React, {useState, useEffect} from 'react';
import moment from "moment";


export default function Steps({ granularity, steps = [], onSelect }) {
  const [selectedSteps, setSelectedSteps] = useState(steps)

  const handleChange = (event) => {
    const steps = [...selectedSteps]
    const checked = event.currentTarget.checked
    const value = event.currentTarget.value
    if (checked) {
      steps.push(value)
    } else {
      steps.splice(selectedSteps.findIndex(s => s === value), 1)
    }
    setSelectedSteps(steps)
    onSelect(steps)
  }

  useEffect(() => {
    setSelectedSteps(steps)
  }, [steps])

  const getStepLabel = (step) => {
    if (granularity === 'MONTH') {
      return moment(step).format('MMMM')
    } else if (granularity === 'DAY') {
      return moment(step).format('YYYY/MM/DD')
    } else if (granularity === 'ISOWEEK') {
      return moment(step).format('[Week] W - YYYY')
    } else if (granularity === 'YEAR') {
      return moment(step).format('YYYY')
    }
    return step
  }

  const isChecked = (step) => selectedSteps.includes(step)

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {steps.map(s => (
        <div key={s} style={{ background: '#DDDDDD', padding: '2px 6px', margin: '2px 4px', borderRadius: '4px' }}>
          <input type="checkbox" id={s} value={s} onChange={handleChange} checked={isChecked(s)} />
          <label for={s}>{getStepLabel(s)}</label>
        </div>
      ))}
    </div>
  )
}
