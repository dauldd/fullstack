import { useState } from 'react'

const Blog = ({ blog, onLike, onDelete, currentUser }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

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
    <div style={blogStyle} className="blog">
      {blog.title} {blog.author}
      <button onClick={() => setVisible(!visible)}>
        {visible ? 'hide' : 'view'}
      </button>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{' '}
            <button data-cy="like-button" onClick={handleLike}>
              like
            </button>
          </div>
          <div>{blog.user?.name}</div>
          {currentUser &&
            blog.user &&
            currentUser.username === blog.user.username && (
            <button id="delete_button" onClick={handleDeleteClick}>
                delete
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
