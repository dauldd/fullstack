const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

describe('blog API tests', () => {

  test('blogs are returned as json and correct length', async () => {
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('blog object uses id property and not _id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body

    assert.ok(blogs[0].id)
    assert.strictEqual(blogs[0]._id, undefined)
  })

  test('defaults likes to 0 if missing', async () => {
    await api.post('/api/blogs').send({
      title: 'New blog',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/'
    })

    const response = await api.get('/api/blogs')
    const addedBlog = response.body.find(b => b.title === 'New blog')
    assert.strictEqual(addedBlog.likes, 0)
  })

  test('returns 400 if title or url is missing', async () => {
    const response1 = await api.post('/api/blogs').send({ author: 'Michael Chan' })
    assert.strictEqual(response1.status, 400)

    const response2 = await api.post('/api/blogs').send({ title: 'Only title' })
    assert.strictEqual(response2.status, 400)
  })

  test('creates a new blog post and verifies it is saved', async () => {
    await api.post('/api/blogs').send({
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7
    })

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length + 1)
    assert.strictEqual(response.body.some(b => b.title === 'React patterns'), true)
  })
})

  test('delete a single blog', async () => {

  const blogsAtStart = await api.get('/api/blogs')
  const blogToDelete = blogsAtStart.body[0]
  
  await api.delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)
    
  const blogsAtEnd = await api.get('/api/blogs')

  assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length - 1)

  const ids = blogsAtEnd.body.map(b => b.id)
  assert(!ids.includes(blogToDelete.id))
})

  test('update likes', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToUpdate = blogsAtStart.body[0]

  const updateData = { likes: blogToUpdate.likes + 1 }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updateData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
 // db
  const blogsAtEnd = await api.get('/api/blogs')
  const updatedBlog = blogsAtEnd.body.find(b => b.id === blogToUpdate.id)
  assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1)
})

after(async () => {
  await mongoose.connection.close()
})