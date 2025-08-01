import axios from 'axios'
const baseUrl = 'https://phonebackend-sfz8.onrender.com/api/persons'

const getAll = () =>
  axios
    .get(baseUrl)
    .then(res => {
      console.log('GET all persons:', res.data)
      return res.data
    })
    
const create = newPerson => axios.post(baseUrl, newPerson).then(res => res.data)

const update = (id, updatedPerson) =>
  axios.put(`${baseUrl}/${id}`, updatedPerson).then(res => res.data)

const remove = id => axios.delete(`${baseUrl}/${id}`)

export default { getAll, create, update, remove }