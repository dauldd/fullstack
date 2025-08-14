import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAll, voteAnecdote } from '../services/anecdotes'
import { useNotificationDispatch } from '../NotificationContext'

const AnecdoteList = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const { data: anecdotes, isLoading, isError } = useQuery(
    ['anecdotes'],
    getAll,
    { retry: false }
  )

  const voteMutation = useMutation(voteAnecdote, {
    onSuccess: () => queryClient.invalidateQueries(['anecdotes'])
  })

  const handleVote = (anecdote) => {
    voteMutation.mutate(anecdote.id)
    dispatch({ type: 'SET_NOTIFICATION', payload: `Voted for: "${anecdote.content}"` })
    setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 5000)
  }

  if (isLoading) return <div>Loading anecdotes...</div>
  if (isError) return <div>Anecdote service not available due to problems in server</div>

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList
