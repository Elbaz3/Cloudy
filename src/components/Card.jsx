import React from 'react'

const Card = (({minTemp, maxTemp, day, img}) => {
   console.log()
   function getDay() {
      const today = new Date().toISOString().split('T')[0]
      if (day === today) {
         return 'Today'
      } else {
         const daay = new Date(day).toLocaleDateString('en-US', {weekday: 'long'})
         return daay
      }

   }

  return (
   <div className="item py-4 h-full min-w-[160px] flex flex-col justify-between gap-2 items-center">
      <h2 className='text-yellow-300'>{getDay()}</h2>
      <img className='w-[50px]' src={img} alt="" />
      <div className="temp flex gap-2">
      <p className="min text">{minTemp + '°'}</p>
      <p className="max">{maxTemp + '°'}</p>
      </div>
   </div>
  )
})

export default Card