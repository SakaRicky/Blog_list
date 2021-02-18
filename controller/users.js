const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
    users = await User.find({}).populate('blogs', {title:1})
    return response.json(users)
})

usersRouter.post('/', async (request, response, next) => {
  const body = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    password: passwordHash
  })
  const result = await user.save()
  return response.status(201).json(result)
})

usersRouter.delete('/:id', async (request, response, next) => {
  const result = await User.findByIdAndRemove(request.params.id)
  return response.status(200).json(result)
})

usersRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    likes: body.likes
  }
  const result = await User.findByIdAndUpdate(request.params.id, blog, { new: true })

  return response.json(result)
})

module.exports = usersRouter