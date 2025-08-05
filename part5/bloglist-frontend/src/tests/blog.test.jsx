import { render, screen, fireEvent } from '@testing-library/react'
import Blog from '../components/Blog'
import BlogForm from '../components/BlogForm'
import { vi } from 'vitest'

describe('Blog', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'John Doe',
    url: 'http://example.com',
    likes: 5,
    user: { username: 'johndoe' },
  }

  test('renders title and author but not url or likes by default', () => {
    render(<Blog blog={blog} />)

    const titleAuthorElement = screen.getByText(
      'Component testing is done with react-testing-library John Doe',
    )
    expect(titleAuthorElement).toBeDefined()

    expect(screen.queryByText('http://example.com')).toBeNull()
    expect(screen.queryByText(/likes/i)).toBeNull()
  })

  test('renders url and likes when view button is clicked', () => {
    render(<Blog blog={blog} />)

    const button = screen.getByText('view')
    fireEvent.click(button)

    expect(screen.getByText('http://example.com')).toBeDefined()
    expect(screen.getByText(/likes 5/)).toBeDefined()
  })

  test('calls onLike twice when like button is clicked twice', () => {
    const mockHandler = vi.fn()

    render(<Blog blog={blog} onLike={mockHandler} />)

    const viewButton = screen.getByText('view')
    fireEvent.click(viewButton)

    const likeButton = screen.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockHandler).toHaveBeenCalledTimes(2)
  })
})

test('calls createBlog with correct details when new blog is created', () => {
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('Title')
  const authorInput = screen.getByPlaceholderText('Author')
  const urlInput = screen.getByPlaceholderText('URL')

  fireEvent.change(titleInput, { target: { value: 'Testing' } })
  fireEvent.change(authorInput, { target: { value: 'Jane Doe' } })
  fireEvent.change(urlInput, { target: { value: 'http://test.com' } })

  const form = screen.getByTestId('blog-form')
  fireEvent.submit(form)

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'Testing',
    author: 'Jane Doe',
    url: 'http://test.com',
  })
})
