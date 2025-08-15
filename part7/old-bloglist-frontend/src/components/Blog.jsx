import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Button, Collapse } from 'react-bootstrap'

const Blog = ({ blog, onLike, onDelete, currentUser }) => {
  const [visible, setVisible] = useState(false)

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    }
    onLike(updatedBlog)
  }

  const handleDeleteClick = () => {
    onDelete(blog.id, blog.title)
  }

  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title>
          <Link to={`/blogs/${blog.id}`} className="text-decoration-none">
            {blog.title}
          </Link>
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          by {blog.author}
        </Card.Subtitle>

        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => setVisible(!visible)}
          className="mb-2"
        >
          {visible ? 'Hide' : 'View'} Details
        </Button>

        <Collapse in={visible}>
          <div>
            <Card.Text>
              <a href={blog.url} target="_blank" rel="noopener noreferrer">
                {blog.url}
              </a>
            </Card.Text>
            <Card.Text>
              <strong>{blog.likes} likes</strong>{' '}
              <Button
                variant="success"
                size="sm"
                onClick={handleLike}
                className="ms-2"
              >
                like
              </Button>
            </Card.Text>
            <Card.Text>Added by {blog.user?.name}</Card.Text>
            {currentUser &&
              blog.user &&
              currentUser.username === blog.user.username && (
                <Button variant="danger" size="sm" onClick={handleDeleteClick}>
                  Delete
                </Button>
              )}
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  )
}

export default Blog
