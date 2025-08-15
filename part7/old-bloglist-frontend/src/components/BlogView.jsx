import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, Form, Button, ListGroup } from 'react-bootstrap'
import blogService from '../services/blogs'

const BlogView = () => {
  const { id } = useParams()
  const [comment, setComment] = useState('')
  const queryClient = useQueryClient()

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getAll(),
  })

  const addCommentMutation = useMutation({
    mutationFn: ({ id, comment }) => blogService.addComment(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      setComment('')
    },
  })

  if (isLoading) return <div>Loading...</div>

  const blog = blogs.find((b) => b.id === id)

  if (!blog) {
    return null
  }

  const handleCommentSubmit = (event) => {
    event.preventDefault()
    if (comment.trim()) {
      addCommentMutation.mutate({ id, comment })
    }
  }

  return (
    <div>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title as="h2">
            {blog.title} by {blog.author}
          </Card.Title>
          <Card.Text>
            <a href={blog.url} target="_blank" rel="noopener noreferrer">
              {blog.url}
            </a>
          </Card.Text>
          <Card.Text>
            <strong>{blog.likes} likes</strong>
          </Card.Text>
          <Card.Text>
            Added by <strong>{blog.user.name}</strong>
          </Card.Text>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header as="h4">Comments</Card.Header>
        <Card.Body>
          <Form onSubmit={handleCommentSubmit} className="mb-3">
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add Comment
            </Button>
          </Form>

          {blog.comments && blog.comments.length > 0 ? (
            <ListGroup>
              {blog.comments.map((comment, index) => (
                <ListGroup.Item key={index}>{comment}</ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p className="text-muted">No comments yet</p>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

export default BlogView
