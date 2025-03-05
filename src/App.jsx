import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faMagnifyingGlass, faSnowflake, faXmark, faCircleLeft, faCircleRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from 'react';
import axios from 'axios'
import Card from './components/Card';
import humiditiImg from'./assets/humidity.png'
import air from'./assets/air.png'
import rainy from'./assets/rainy.png'
import wind from'./assets/wind.png'
import cloudy from './assets/cloudy2.jpg'
import rainyw from './assets/rain2.jpg'
import sunny from './assets/partly.jpg'
import snow from './assets/snow2.jpg'
import heavyrain from './assets/rain4.jpg'
import clear from './assets/clear.jpg'


const App = () => {
  const API_Key = '133f4b3465c547279dd114732250103'
  const API_URL = 'https://api.weatherapi.com/v1/forecast.json?key=133f4b3465c547279dd114732250103&q=damietta&days=7'
  const [ data, setData ] = useState({bgImage: 'sunny'})
  const [ error, setError ] = useState('')
  const [ location, setLocation ] = useState('egypt')
  const [ searchInput, setSearchInput ] = useState('')
  const [ loading, setLoading ] = useState(true)
  const [ time, setTime ] = useState({})
  const [ timezone, setTimezone] = useState('Africa/Cairo')
  const [ current, setCurrent] = useState(0)
  const search = useRef(null)
  const slider = useRef(null)


  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const {latitude, longitude} = position.coords;
          const res = await axios.get(`https://api.weatherapi.com/v1/current.json?key=133f4b3465c547279dd114732250103&q=${latitude},${longitude}`)
          setLocation(res.data.location.name)
          setTimezone(res.data.location.tz_id)
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError("Geolocation is not supported.");
    }
  }, [current]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=133f4b3465c547279dd114732250103&q=${location}&days=7`)
        const data = response.data;
        const sky = response.data.current.condition.text
        const forecast = response.data.forecast.forecastday
        const icon = response.data.current.condition.icon
        const bgImage = response.data.current.condition.text
        setData({
          data,
          sky,
          forecast,
          icon,
          bgImage
        })

      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [location, current])


function handleSearchBar () {
  search.current?.classList.toggle('translate-y-[-100px]')
}
function handleSubmit (e) {
  e.preventDefault()
  const fetchData = async () => {
    try {
      const response = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${API_Key}&q=${searchInput}&days=7`)
      const data = response.data;
      const sky = response.data.current.condition.text
      const forecast = response.data.forecast.forecastday
      const icon = response.data.current.condition.icon
      const bgImage = response.data.current.condition.text
      setData({
        data,
        sky,
        forecast,
        icon,
        bgImage
      })
      setTimezone(response.data.location.tz_id)

    } catch (err) {
      setError(err.message)
    }
  }
  
  fetchData()
  setSearchInput('')
}

function handleLeft() {
  slider.current.scrollBy({left: -150, behavior: 'smooth'})
}
function handleRight() {
  slider.current.scrollBy({left: 150, behavior: 'smooth'})
}

useEffect(() => {
  const backgroundMap = {
    "sunny": sunny,
    "heavy rain": heavyrain,
    "partly cloudy": cloudy,
    "cloudy": cloudy,
    "blowing snow": snow,
    "light rain": rainyw,
    "clear": clear
  };

  const current = data.bgImage.toLowerCase().trim()
  document.body.style.backgroundImage = `url(${backgroundMap[current] || sunny})`

}, [data.bgImage])

useEffect( ()=> {
  function updateTime () {
    setTime(() => {
      const now = new Date(new Date().toLocaleString('en-US', { timeZone: timezone }));
      const h = now.getHours() % 12 || 12
      const period = now.getHours() >= 12 ? 'PM' : 'AM'
      const day = new Date().toLocaleDateString('en-US', { weekday: 'long' })
      return {
        hours: `${h}`.padStart(2, "0"),
        minutes: `${now.getMinutes()}`.padStart(2, "0"),
        period,
        day
      }
    })
  }
  
  updateTime ()
  const intervel = setInterval(updateTime , 60000)
  return () => clearInterval(intervel)
}, [timezone])

slider.current ? slider.current.addEventListener('wheel', (e) => {
  e.preventDefault()
  slider.current.scrollLeft += e.deltaY/2
}) : null

  return (
    <main className='z-2 relative p-8 flex flex-col justify-between h-screen   items-center'>
      { !loading ? ( <>
        <form id='search' onSubmit={handleSubmit} ref={search} className='absolute border-2 p-2 border-gray-600 translate-y-[-100px]
        z-20 w-1/2 h-10 left-1/4  ease-in-out duration-800 rounded-xl flex shadow-gray-800 shadow-2xl'>
          <FontAwesomeIcon onClick={handleSearchBar} className='absolute top-[-20px] right-1/2 cursor-pointer' icon={faXmark} />
          <input
            name='search'
            value={searchInput}
            type="text" 
            placeholder='write your location' 
            className='w-full border-0 outline-0'
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button className='absolute right-3 top-1' type='submit'><FontAwesomeIcon className='cursor-pointer' icon={faMagnifyingGlass} /></button>
        </form>
      <section className="top flex justify-evenly md:justify-between max-sm:mt-10 w-full flex-wrap gap-5.5">
        <div className="deg flex flex-col gap-5 p-2 rounded-2xl h-fit bg-black/40 backdrop-blur-lg ">
        { loading ? <p>loading ...</p> 
        : 
          <>
            <div className='flex flex-col '>
              <img className='w-[50px]' src={data.icon} alt="icon" />
              <h3 className='cloud text-2xl'>{data.sky}</h3>
              <p className="city text-sm">{data.data.location?.name + ' - ' + data.data.location?.country || 'Unknown'}</p>
            </div>
            <h1 className='text-3xl font-bold'>{data.data.current?.temp_c} °C</h1>
            <p onClick={handleSearchBar} className='text-sm text-gray-400 cursor-pointer '><FontAwesomeIcon className='mr-1' icon={faLocationDot}/>Change Location</p>
            <p onClick={() => setCurrent(current + 1)} className='text-sm text-gray-400 cursor-pointer '><FontAwesomeIcon className='mr-1' icon={faLocationDot}/>My Location</p>
          </> 
          }
        </div>
        <div className="time flex flex-col gap-5 p-2 rounded-2xl h-fit bg-black/40 backdrop-blur-lg ">
        { Object.keys(time).length === 0 ? <FontAwesomeIcon className='text-xl text-blue-300 absolute left-1/2 top-1/2 translate-[-50%]' icon={faSnowflake} spin />
        : 
          <div className='flex flex-col gap-3 items-center p-2 text-4xl w-[50px]'>
            <p className='text-[10px] text-amber-500'>{time.day}</p>
            <div className="time flex flex-col items-center gap-1">
              <span className='text-sm'>{time.period}</span>
              <p>{time?.hours }</p>
              <p>{(time?.minutes)}</p>
            </div>
          </div> 
          }
        </div>
        <div className='info flex flex-col gap-5 p-3 rounded-2xl bg-black/40 backdrop-blur-lg text-[13px] text-gray-300'>
          <div className='box flex gap-1'>
            <img className='text-white' style={{width: '25px', height: '25px'}} src={humiditiImg} alt="humidity" />
            <div className='humidity'>
              <p>humidity</p>
              <h3 className='text-white text-2xl'>{data.data.current?.humidity || 'unknown'}</h3>
            </div>
          </div>
          <div className='box flex gap-1'>
            <img style={{width: '25px', height: '25px'}} src={air} alt="air" />
            <div className='humidity'>
              <p>Air Pressure</p>
              <h3 className='text-white text-2xl'>{data.data.current?.pressure_mb || 'unknown'} mb</h3>
            </div>
          </div>
          <div className='box flex gap-1'>
            <img style={{width: '25px', height: '25px'}} src={rainy} alt="rainy" />
            <div className='humidity'>
              <p>Chance Of Rain</p>
              <h3 className='text-white text-2xl'>{data.data.forecast?.forecastday[0]?.day?.daily_chance_of_rain} %</h3>
            </div>
          </div>
          <div className='box flex gap-1'>
            <img style={{width: '25px', height: '25px'}} src={wind} alt="wind" />
            <div className='humidity'>
              <p>Wind Speed</p>
              <h3 className='text-white text-2xl'>{data.data.current?.wind_kph || 'unknown'} km/h</h3>
            </div>
          </div>

        </div>
      </section>
      <section className="slider z-1 text-white pb-5  flex flex-col w-full">
        <div  className="flex gap-3 pb-2">
          <FontAwesomeIcon className='cursor-pointer' onClick={handleLeft} icon={faCircleLeft} />
          <FontAwesomeIcon className='cursor-pointer' onClick={handleRight} icon={faCircleRight} />
        </div>
        <div ref={slider} className="slider flex justify-between gap-2.5 h-[150px] overflow-x-auto  hidescroll bg-black/40 backdrop-blur-lg rounded-2xl">
          {
            data.forecast.length ? 
            data.forecast.map((item, index) => (
              <Card key={index} minTemp={item.day.mintemp_c} maxTemp={item.day.maxtemp_c} day={item.date} img={item.day.condition.icon} />
            )) 
            : <p className='text-center w-full text-5xl text-red-700'>no data</p>
          }
        </div>
      </section> </>) : (
        <FontAwesomeIcon className='text-4xl text-blue-300 absolute left-1/2 top-1/2 translate-[-50%]' icon={faSnowflake} spin />
      )
    }
    </main>
  )
}

export default App