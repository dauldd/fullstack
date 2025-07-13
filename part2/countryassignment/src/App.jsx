import { useState, useEffect } from 'react'
import axios from 'axios'

const CountryDetails = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const api_key = import.meta.env.VITE_WEATHER_API_KEY
  const capital = country.capital?.[0]

  useEffect(() => {
    if (!capital) return

    setLoading(true)
    setError(null)

    axios
      .get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: capital,
          appid: api_key,
          units: 'metric'
        }
      })
      .then(response => {
        setWeather(response.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to fetch weather data')
        setLoading(false)
      })
  }, [capital, api_key])

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {capital}</p>
      <p>Area: {country.area}</p>
      <h4>Languages:</h4>
      <ul>
        {country.languages && Object.values(country.languages).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <img src={country.flags?.png} alt={`Flag of ${country.name.common}`} width="150" />
      <h3>Weather in {capital}</h3>
      {loading && <p>Loading weather...</p>}
      {error && <p>{error}</p>}
      {weather && (
        <div>
          <p>Temperature: {weather.main.temp} °C</p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  )
}

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null)
  }

  const handleShowClick = (country) => {
    setSelectedCountry(country)
  }

  const countriesToShow = search
    ? countries.filter(country =>
      country.name.common.toLowerCase().includes(search.toLowerCase()))
    : countries

  let content = null

  if (selectedCountry) {
    content = <CountryDetails country={selectedCountry} />
  } else if (countriesToShow.length > 10) {
    content = <p>Too many matches, specify another filter</p>
  } else if (countriesToShow.length > 1) {
    content = (
      <ul>
        {countriesToShow.map(country => (
          <li key={country.cca3}>
            {country.name.common}
            <button onClick={() => handleShowClick(country)}>Show</button>
          </li>
        ))}
      </ul>
    )
  } else if (countriesToShow.length === 1) {
    content = <CountryDetails country={countriesToShow[0]} />
  }

  return (
    <div>
      <h1>filter by country</h1>
      <div>
        find countries: <input value={search} onChange={handleSearchChange} />
      </div>
      {content}
    </div>
  )
}

export default App
