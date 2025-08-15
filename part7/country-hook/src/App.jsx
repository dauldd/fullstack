import { useState } from 'react'
import useCountry from './hooks/useCountry'

const App = () => {
  const [name, setName] = useState('')
  const [search, setSearch] = useState('')
  const { country, found } = useCountry(search)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSearch(name)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter country name"
        />
        <button type="submit">Find</button>
      </form>

      {search && (
        <div style={{ marginTop: '20px' }}>
          {found ? (
            <div>
              <h3>{country.name.common}</h3>
              <div>Capital: {country.capital}</div>
              <div>Population: {country.population}</div>
              <img
                src={country.flags.png}
                alt={`Flag of ${country.name.common}`}
                height="100"
              />
            </div>
          ) : (
            <div>Country not found...</div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
