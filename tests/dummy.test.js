const listHelper = require('../utils/list_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeAll(async () => {
    await mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: false, useFindAndModify: false, useCreateIndex: true });
  });

const initialBlogs = [
    {
        title: "How to write node restful api",
        author: "Saka Ricky",
        url: "www.url.com",
        likes: 200,
    },
    {
        title: "Accountancy, an interesting topic",
        author: "Rheine Saka",
        url: "www.url.com",
        likes: 3000,
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})

// Using supertest
test('return blogs should be json', async () => {
    await api.get('/api/blogs')
             .expect(200)
             .expect('Content-type', /application\/json/)

})


test('make a get request to /api/blogs url', async () => {
    const response_blogs = await api.get('/api/blogs')
    expect(response_blogs.body).toHaveLength(initialBlogs.length)
})

test('a specific note is among the returned notes', async () => {
    const response_blogs = await api.get('/api/blogs')

    const titles = response_blogs.body.map(blog => blog.title)
    expect(titles).toContain("How to write node restful api")
})

test('id should be defined for any post', async () => {
    const response = await api.get('/api/blogs')

    response.body.map(blog => expect(blog.id).toBeDefined())
})

test('should save a post successfully', async () => {
    const saved_blog = await api.post('/api/blogs')
             .send({
                    title: "Side projects help consolidate programming knowledge",
                    author: "Ricky Saka",
                    url: "www.url.com",
                    likes: 9850,
                })
    all_blogs = await api.get('/api/blogs')
    const titles = all_blogs.body.map(blog => blog.title)
    expect(titles).toContain("Side projects help consolidate programming knowledge")

})

test('should return 0 if like property is missing', async () => {
    const saved_blog = await api.post('/api/blogs')
             .send({
                    title: "Post without likes property",
                    author: "Ricky Saka",
                    url: "www.url.com",
                })
    expect(saved_blog.body.likes).toBe(0)
})

test('should return status 400 if missing title and url', async () => {
    const saved_blog = await api.post('/api/blogs')
             .send({ url: "www.url.com" })
    expect(saved_blog.status).toBe(400)
})

test('should delete a note from the database', async () => {
    const saved_blogs = await api.get('/api/blogs')
    const first_blog = saved_blogs.body[0]

    const result = await api.delete(`/api/blogs/${first_blog.id}`)

   expect(first_blog.title).toBe(result.body.title)

})

test('should update a note from the database', async () => {
    const saved_blogs = await api.get('/api/blogs')
    const first_blog = saved_blogs.body[0]

    const result = await api.put(`/api/blogs/${first_blog.id}`).send({likes: 12345})

   expect(first_blog.likes).not.toBe(result.body.likes)

})

afterAll(() => {
    mongoose.connection.close()
  })



// const blogs = [ 
//     { 
//         _id: "5a422a851b54a676234d17f7", 
//         title: "React patterns", 
//         author: "Michael Chan", 
//         url: "https://reactpatterns.com/", 
//         likes: 7, 
//         __v: 0 
//     }, 
//     { 
//         _id: "5a422aa71b54a676234d17f8", 
//         title: "Go To Statement Considered Harmful", 
//         author: "Edsger W. Dijkstra", 
//         url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", 
//         likes: 5, 
//         __v: 0 
//     }, 
//     {
//          _id: "5a422b3a1b54a676234d17f9", 
//          title: "Canonical string reduction", 
//          author: "Edsger W. Dijkstra", 
//          url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", 
//          likes: 12, 
//          __v: 0 
//     }, 
//     { 
//         _id: "5a422b891b54a676234d17fa", 
//         title: "First class tests", 
//         author: "Robert C. Martin", 
//         url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll", 
//         likes: 10,
//          __v: 0 
//     }, 
//     { 
//         _id: "5a422ba71b54a676234d17fb", 
//         title: "TDD harms architecture", 
//         author: "Robert C. Martin", 
//         url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", 
//         likes: 0, 
//         __v: 0 
//     }, 
//     { 
//         _id: "5a422bc61b54a676234d17fc", 
//         title: "Type wars", 
//         author: "Robert C. Martin", 
//         url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", 
//         likes: 2, 
//         __v: 0 
//     }
// ]

// test('dummy returns one', () => {
//   const blogs = []

//   const result = listHelper.dummy(blogs)
//   expect(result).toBe(1)
// })

// describe('total likes', () => {
    
//     test('when list has only one blog, equals the likes of that ', () => {
//         const result = listHelper.totalLikes(blogs.slice(0, 1))
//         expect(result).toBe(7)
//     })


//     test('should return 0 on empty list', () => {
//         const result = listHelper.totalLikes([])
//         expect(result).toBe(0)
//     })

//     test('should return likes of 2 first elements', () => {
//         const result = listHelper.totalLikes(blogs.slice(0, 2))
//         expect(result).toBe(12)
//     })

//     test('should return likes of all the elements', () => {
//         const result = listHelper.totalLikes(blogs)
//         expect(result).toBe(36)
//     })
    
// })

// describe('favorite blog', () => {
    
//     test('when list has only one blog, equals the likes of that ', () => {
//         const result = listHelper.favoriteBlog(blogs.slice(0, 1))
//         expect(result).toEqual({title: "React patterns", author: "Michael Chan", likes: 7})
//     })


//     test('should return null on empty list', () => {
//         const result = listHelper.favoriteBlog([])
//         expect(result).toBe(null)
//     })

//     test('should return likes of 2 first elements', () => {
//         const result = listHelper.favoriteBlog(blogs.slice(0, 2))
//         expect(result).toEqual({title: "React patterns", author: "Michael Chan", likes: 7})
//     })

//     test('should return likes of all the elements', () => {
//         const result = listHelper.favoriteBlog(blogs)
//         expect(result).toEqual({title: "Canonical string reduction", author: "Edsger W. Dijkstra", likes: 12})
//     })
    
