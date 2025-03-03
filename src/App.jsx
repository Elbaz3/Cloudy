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
  const [data, setData] = useState({})
  const [error, setError] = useState('')
  const [sky, setSky] = useState('')
  const [location, setLocation] = useState('egypt')
  const [searchInput, setSearchInput] = useState('')
  const [forecast, setForecast] = useState([])
  const search = useRef(null)
  const slider = useRef(null)
  const [loading, setLoading] = useState(true)
  const [icon, setIcon] = useState('')
  const [bgimage, setBgimage] = useState('')
  const images = {
    sunny: ['sunny'], 
    cloudy: ['cloudy', 'cloudy2', 'cloudy3'], 
    partly: ['partly', 'partly2'], 
    rain: ['rain', 'rain2', 'rain3', 'rain4'],
    snow: ['snow', 'snow2', 'snow3']
  }

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const {latitude, longitude} = position.coords;
          const res = await axios.get(`https://api.weatherapi.com/v1/current.json?key=133f4b3465c547279dd114732250103&q=${latitude},${longitude}`)
          setLocation(res.data.location.name)
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError("Geolocation is not supported.");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=133f4b3465c547279dd114732250103&q=${location}&days=7`)
        setData(response.data)
        setSky(response.data.current.condition.text)
        setForecast(response.data.forecast.forecastday)
        setIcon(response.data.current.condition.icon)
        setBgimage(response.data.current.condition.text)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [location])



function handleSearchBar () {
  search.current?.classList.toggle('translate-y-[-100px]')
}
function handleSubmit (e) {
  e.preventDefault()
  const fetchData = async () => {
    try {
      const response = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${API_Key}&q=${searchInput}&days=7`)
      setData(response.data)
      setSky(response.data.current.condition.text)
      setForecast(response.data.forecast.forecastday)
      setIcon(response.data.current.condition.icon)
      setBgimage(response.data.current.condition.text)
    } catch (err) {
      setError(err.messege)
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
  const current = bgimage || 'sunny'
  if (current.toLowerCase() === 'sunny') {
    document.body.style.backgroundImage = `url(${sunny})`
  } else if (current.toLowerCase().trim() === 'heavy rain') {
    document.body.style.backgroundImage = `url(${heavyrain})`

  }else if (current.toLowerCase().trim() === 'partly cloudy'|| current.toLowerCase().trim() === 'cloudy') {
    document.body.style.backgroundImage = `url(${cloudy})`

  } else if (current.toLowerCase().trim() === 'blowing snow') {
    document.body.style.backgroundImage = `url(${snow})`

  }else if (current.toLowerCase().trim() === 'light rain') {
    document.body.style.backgroundImage = `url(${rainyw})`

  } else if (current.toLowerCase().trim() === 'clear'){
    document.body.style.backgroundImage = `url(${clear})`

  }
}, [bgimage])


  return (
    <main className='z-2 relative p-8 flex flex-col justify-between h-screen   items-center'>
      { !loading ? ( <>
        <form onSubmit={handleSubmit} ref={search} className='absolute border-2 p-2 border-gray-600 translate-y-[-100px]
        z-20 w-1/2 h-10 left-1/4  ease-in-out duration-800 rounded-xl flex shadow-gray-800 shadow-2xl'>
          <FontAwesomeIcon onClick={handleSearchBar} className='absolute top-[-20px] right-1/2 cursor-pointer' icon={faXmark} />
          <input
            value={searchInput}
            type="text" 
            placeholder='write your location' 
            className='w-full border-0 outline-0'
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button className='absolute right-3 top-1' type='submit'><FontAwesomeIcon className='cursor-pointer' icon={faMagnifyingGlass} /></button>
        </form>
      <section className="top flex justify-center md:justify-between max-sm:mt-10 w-full flex-wrap gap-5.5 items-center">
        <div className="deg flex flex-col gap-5 p-2 rounded-2xl h-fit bg-black/40 backdrop-blur-lg">
        { loading ? <p>loading ...</p> 
        : 
          <>
            <div className='flex flex-col '>
              <img className='w-[50px]' src={icon} alt="icon" />
              <h3 className='cloud text-2xl'>{sky}</h3>
              <p className="city text-sm">{data.location?.name + ' - ' + data.location?.country || 'Unknown'}</p>
            </div>
            <h1 className='text-3xl font-bold'>{data.current?.temp_c} C</h1>
            <p onClick={handleSearchBar} className='text-sm text-gray-400 cursor-pointer '><FontAwesomeIcon className='mr-1' icon={faLocationDot}/>Change Location</p>
          </> 
          }
        </div>
        <div className='info flex flex-col gap-5 p-3 rounded-2xl bg-black/40 backdrop-blur-lg text-[13px] text-gray-300'>
          <div className='box flex gap-1'>
            <img className='text-white' style={{width: '25px', height: '25px'}} src={humiditiImg} alt="humidity" />
            <div className='humidity'>
              <p>humidity</p>
              <h3 className='text-white text-2xl'>{data.current?.humidity || 'unknown'}</h3>
            </div>
          </div>
          <div className='box flex gap-1'>
            <img style={{width: '25px', height: '25px'}} src={air} alt="air" />
            <div className='humidity'>
              <p>Air Pressure</p>
              <h3 className='text-white text-2xl'>{data.current?.pressure_mb || 'unknown'} mb</h3>
            </div>
          </div>
          <div className='box flex gap-1'>
            <img style={{width: '25px', height: '25px'}} src={rainy} alt="rainy" />
            <div className='humidity'>
              <p>Chance Of Rain</p>
              <h3 className='text-white text-2xl'>{data.forecast?.forecastday[0]?.day?.daily_chance_of_rain} %</h3>
            </div>
          </div>
          <div className='box flex gap-1'>
            <img style={{width: '25px', height: '25px'}} src={wind} alt="wind" />
            <div className='humidity'>
              <p>Wind Speed</p>
              <h3 className='text-white text-2xl'>{data.current?.wind_kph || 'unknown'} km/h</h3>
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
            forecast.length ? 
            forecast.map((item, index) => (
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