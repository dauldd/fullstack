import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdoteAsync } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'


const AnecdoteList = () => {
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    const filtered = filter
      ? anecdotes.filter(a =>
          a.content.toLowerCase().includes(filter.toLowerCase())
        )
      : anecdotes
    return [...filtered].sort((a, b) => b.votes - a.votes)
  })
  const dispatch = useDispatch()

  const vote = (id, content) => {
    dispatch(voteAnecdoteAsync(id))
    dispatch(showNotification(`You voted for: "${content}"`, 5))
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList