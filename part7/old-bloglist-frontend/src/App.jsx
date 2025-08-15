import { useState, useRef, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Users from './components/Users'
import User from './components/User'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import { useNotification } from './contexts/NotificationContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useUser } from './contexts/userContext'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import BlogView from './components/BlogView'
import { Container, Navbar, Nav, Button } from 'react-bootstrap'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  // const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const { showNotification } = useNotification()
  const { user, login, logout, initializeUser } = useUser()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const savedUser = JSON.parse(loggedUserJSON)
      initializeUser(savedUser)
      blogService.setToken(savedUser.token)
    }
  }, [initializeUser])

  const {
    data: blogs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getAll(),
    enabled: !!user,
  })

  const queryClient = useQueryClient()

  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const likeBlogMutation = useMutation({
    mutationFn: ({ id, updatedBlog }) => blogService.update(id, updatedBlog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedInUser = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(loggedInUser)
      )
      blogService.setToken(loggedInUser.token)
      login(loggedInUser)
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
    logout()
  }

  const createBlog = async (blogObject) => {
    try {
      const createdBlog = await createBlogMutation.mutateAsync(blogObject)
      showNotification(
        `a new blog ${createdBlog.title} by ${createdBlog.author} added`
      )
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      showNotification('Failed to create blog', 'error')
    }
  }

  const handleLike = async (updatedBlog) => {
    await likeBlogMutation.mutateAsync({ id: updatedBlog.id, updatedBlog })
  }

  const handleDelete = async (id, title) => {
    const confirmDelete = window.confirm(`Remove blog "${title}"?`)
    if (!confirmDelete) return

    try {
      await deleteBlogMutation.mutateAsync(id)
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
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Blog app
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/blogs">
                Blogs
              </Nav.Link>
              <Nav.Link as={Link} to="/users">
                Users
              </Nav.Link>
            </Nav>
            <Nav>
              {user ? (
                <div className="d-flex align-items-center">
                  <span className="navbar-text me-3">
                    Welcome, {user.name}!
                  </span>
                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Notification />
        <Routes>
          <Route path="/blogs/:id" element={<BlogView />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/users" element={<Users />} />
          <Route
            path="/blogs"
            element={
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2>Blogs</h2>
                  <Togglable buttonLabel="Create New Blog" ref={blogFormRef}>
                    <BlogForm createBlog={createBlog} />
                  </Togglable>
                </div>
                <div className="row">
                  {blogs.map((blog) => (
                    <div key={blog.id} className="col-md-6 mb-3">
                      <Blog
                        blog={blog}
                        onLike={handleLike}
                        onDelete={handleDelete}
                        currentUser={user}
                      />
                    </div>
                  ))}
                </div>
              </div>
            }
          />
          <Route
            path="/"
            element={
              <div>
                <div className="text-center mb-5">
                  <h1 className="display-4">Welcome to Blog App</h1>
                  <p className="lead">Share your thoughts with the world</p>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2>Latest Blogs</h2>
                  <Togglable buttonLabel="Create New Blog" ref={blogFormRef}>
                    <BlogForm createBlog={createBlog} />
                  </Togglable>
                </div>
                <div className="row">
                  {blogs.map((blog) => (
                    <div key={blog.id} className="col-md-6 mb-3">
                      <Blog
                        blog={blog}
                        onLike={handleLike}
                        onDelete={handleDelete}
                        currentUser={user}
                      />
                    </div>
                  ))}
                </div>
              </div>
            }
          />
        </Routes>
      </Container>
    </Router>
  )
}

export default App
