import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [notification, setNotification] = useState({
    message: null,
    type: null,
  })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const savedUser = JSON.parse(loggedUserJSON)
      setUser(savedUser)
      blogService.setToken(savedUser.token)
    }
  }, [])

  useEffect(() => {
    if (user) {
      blogService
        .getAll()
        .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)))
    }
  }, [user])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedInUser = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(loggedInUser),
      )
      blogService.setToken(loggedInUser.token)
      setUser(loggedInUser)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const blogFormRef = useRef()

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const createBlog = async (blogObject) => {
    try {
      const createdBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(createdBlog).sort((a, b) => b.likes - a.likes))
      showNotification(
        `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
      )

      blogFormRef.current.toggleVisibility()
    } catch (error) {
      showNotification('Failed to create blog', 'error')
    }
  }

  const handleLike = async (updatedBlog) => {
    const returnedBlog = await blogService.update(updatedBlog.id, updatedBlog)

    setBlogs(
      blogs
        .map((b) => (b.id === returnedBlog.id ? returnedBlog : b))
        .sort((a, b) => b.likes - a.likes),
    )
  }

  const handleDelete = async (id, title) => {
    const confirmDelete = window.confirm(`Remove blog "${title}"?`)

    if (!confirmDelete) return

    try {
      await blogService.remove(id)
      setBlogs(blogs.filter((blog) => blog.id !== id))
      showNotification(`Blog "${title}" removed successfully`)
    } catch (error) {
      showNotification('Failed to delete blog', 'error')
    }
  }

  if (user === null) {
    return (
      <LoginForm
        handleLogin={handleLogin}
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        errorMessage={errorMessage}
      />
    )
  }

  return (
    <div>
      <Notification message={notification.message} type={notification.type} />
      <p>
        {user.name} logged-in <button onClick={handleLogout}>logout</button>
      </p>
      <h2>blogs</h2>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          onLike={handleLike}
          onDelete={handleDelete}
          currentUser={user}
        />
      ))}
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
    </div>
  )
}

export default App
