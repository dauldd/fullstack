import { useDispatch } from 'react-redux'
import { createAnecdoteAsync } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const handleSubmit = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    dispatch(createAnecdoteAsync(content))
    dispatch(showNotification(`You created: "${content}"`, 5))
    event.target.anecdote.value = ''
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="anecdote" />
      <button type="submit">create</button>
    </form>
  )
}

export default AnecdoteForm