import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export const createAnecdote = async (content) => {
  const newAnecdote = {
    content,
    votes: 0
  }
  const response = await axios.post(baseUrl, newAnecdote)
  return response.data
}

export const voteAnecdote = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  const anecdote = response.data

  const updatedAnecdote = {
    ...anecdote,
    votes: anecdote.votes + 1
  }

  const updateResponse = await axios.put(`${baseUrl}/${id}`, updatedAnecdote)
  return updateResponse.data
}
