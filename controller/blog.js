const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username:1})
    return response.json(blogs)
})

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }

  return null
}

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  console.log('getTokenFrom(request): ', getTokenFrom(request));

  const token = getTokenFrom(request)
  if (!token) {
    return response.status(401).json({error: 'missing token'})
  }

  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({error: 'invalid token'})
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })


  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  return response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const result = await Blog.findByIdAndRemove(request.params.id)
  return response.status(200).json(result)
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    likes: body.likes
  }
  const result = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })

  return response.json(result)
})

module.exports = blogsRouter