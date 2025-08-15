import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ListGroup } from 'react-bootstrap'
import usersService from '../services/users'

const User = () => {
  const { id } = useParams()

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: usersService.getAll,
  })

  if (isLoading) return <div>Loading...</div>

  const user = users.find((u) => u.id === id)

  if (!user) {
    return null
  }

  return (
    <div>
      <h2 className="mb-4">{user.name}</h2>
      <h4 className="mb-3">Added blogs</h4>
      {user.blogs.length === 0 ? (
        <p className="text-muted">No blogs added yet</p>
      ) : (
        <ListGroup>
          {user.blogs.map((blog) => (
            <ListGroup.Item key={blog.id}>{blog.title}</ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  )
}

export default User
