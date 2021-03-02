const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const config = require('../utils/config')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


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

    const saltRounds = 10
    let passwordHash = await bcrypt.hash(initialUsers[0].password, saltRounds)

    let userObject = new User({
        username: initialUsers[0].username,
        name: initialUsers[0].name,
        password: passwordHash
    })

    await userObject.save()

    passwordHash = await bcrypt.hash(initialUsers[1].password, saltRounds)

    userObject = new User({
        username: initialUsers[1].username,
        name: initialUsers[1].name,
        password: passwordHash
    })
    
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