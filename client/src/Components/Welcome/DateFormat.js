import React from 'react'
import './DateFormat.css'
const DateFormat = (props) => {
  console.log(props);
    const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const getMonth=months[props.date.getMonth()]
    return (<div className='date'>
      <span>{props.date.getDate()}</span>
      <span>{getMonth}</span>
      <span>{props.date.getFullYear()}</span>
    </div>
    )
}

export default DateFormat
