import { useState, useEffect } from 'react'
import axios from 'axios'

const useCountry = (name) => {
  const [country, setCountry] = useState(null)
  const [found, setFound] = useState(false)

  useEffect(() => {
    if (!name) return

    const fetchCountry = async () => {
      try {
        const response = await axios.get(
          `https://studies.cs.helsinki.fi/restcountries/api/name/${name}`
        )
        setCountry(response.data)
        setFound(true)
      } catch (error) {
        setCountry(null)
        setFound(false)
      }
    }

    fetchCountry()
  }, [name])

  return { country, found }
}

export default useCountry
