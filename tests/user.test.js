const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const config = require('../utils/config')
const mongoose = require('mongoose')

beforeAll(async () => {
    await mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });
  });

const initialUsers = [
    {
        username: "root",
        name: "admin",
        password: "123456",
    },
    {
        username: "rickysaka91",
        name: "admin",
        password: "jw76102907",
    }
]

beforeEach(async () => {
    await User.deleteMany({})
    let userObject = new User(initialUsers[0])
    await userObject.save()
    userObject = new User(initialUsers[1])
    await userObject.save()
})

// Using supertest
test('return users should be json', async () => {
    await api.get('/api/users')
             .expect(200)
             .expect('Content-type', /application\/json/)

})

test('Valid user is created', async () => {
    const response = await api.post('/api/users')
       .send(
        {
            username: "ricky91",
            name: "admin",
            password: "jw76102907",
        }).expect(201)
    
    expect(response.body.username).toBe('ricky91')
})

test('Invalid user is not created', async () => {
    const response = await api.post('/api/users')
       .send(
        {
            username: "ri",
            name: "admin",
            password: "jw76102907",
        }).expect(400)
    
    expect(response.body.error).toContain('User validation failed')
})

afterAll(async () => {
    await mongoose.connection.close()
  })