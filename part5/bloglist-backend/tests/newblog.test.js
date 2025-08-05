const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert/strict')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('secret', 10)
  const user = new User({ username: 'creator', name: 'Creator Name', passwordHash })
  await user.save()

  const loginRes = await api
    .post('/api/login')
    .send({ username: 'creator', password: 'secret' })
    .expect(200)

  token = loginRes.body.token
  assert.ok(token, 'Token should exist after login')

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Populated Blog', author: 'Someone', url: 'http://example.com', likes: 2 })
    .expect(201)
})

test('blogs include populated user info', async () => {
  const res = await api.get('/api/blogs').expect(200)

  assert.equal(res.body.length, 1)
  const blog = res.body[0]
  assert.equal(blog.user.username, 'creator')
  assert.equal(blog.user.name, 'Creator Name')
})

test('users include their blogs', async () => {
  const res = await api.get('/api/users').expect(200)

  assert.equal(res.body.length, 1)
  const user = res.body[0]
  assert.ok(Array.isArray(user.blogs))
  assert.equal(user.blogs.length, 1)
  assert.equal(user.blogs[0].title, 'Populated Blog')
})

test('creating a blog fails with 401 if token is missing', async () => {
  const newBlog = { title: 'Unauthorized Blog', author: 'Unknown', url: 'http://unauthorized.com', likes: 1 }

  await api.post('/api/blogs').send(newBlog).expect(401)
})

after(async () => {
  await mongoose.connection.close()
})
