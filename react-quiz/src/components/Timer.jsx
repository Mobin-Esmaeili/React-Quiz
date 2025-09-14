import React, { useEffect } from 'react'

const Timer = ({dispatch , secondsRemainig}) => {

const min = Math.floor(secondsRemainig / 60)
const sec = Math.floor(secondsRemainig % 60)

  useEffect(() => {
    const id = setInterval(function () {
        dispatch({type: "tick"})
    } , 1000)

    return () => {clearInterval(id)}
  } , [dispatch])  
  return (
    <div className='timer'>{min < 10 && "0"}{min} : {sec < 10 && "0"}{sec}</div>
  )
}

export default Timer