const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
  const user = new User({ username: 'root', passwordHash: 'hashedpw' })
  await user.save()
})

test('fresh username accepted', async () => {
  const newUser = { username: 'mluukkai', name: 'Matti Luukkainen', password: 'salainen' }

  const res = await api.post('/api/users').send(newUser).expect(201).expect('Content-Type', /application\/json/)

  const users = await User.find({})
  assert.strictEqual(users.length, 2)
})

test('username too short denied', async () => {
  const newUser = { username: 'ro', name: 'Root', password: 'secret' }

  const res = await api.post('/api/users').send(newUser).expect(400)
  assert.match(res.body.error, /username must be at least 3/)
})

test('password too short denied', async () => {
  const newUser = { username: 'namename', name: 'Name', password: 'ps' }

  const res = await api.post('/api/users').send(newUser).expect(400)
  assert.match(res.body.error, /password must be at least 3/)
})

test('duplicate username denied', async () => {
  const newUser = { username: 'root', name: 'Superuser', password: 'secret' }

  const res = await api.post('/api/users').send(newUser).expect(400)
  assert.match(res.body.error, /username must be unique/)
})

after(async () => {
  await mongoose.connection.close()
})
