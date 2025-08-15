import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'
import usersService from '../services/users'

const Users = () => {
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: usersService.getAll,
  })

  if (isLoading) return <div>Loading users...</div>
  if (error) return <div>Error loading users: {error.message}</div>

  return (
    <div>
      <h2 className="mb-4">Users</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>User</th>
            <th>Blogs Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Users
