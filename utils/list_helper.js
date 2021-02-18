const dummy = (blogs) => {
    // ...
    return 1
  }

  const totalLikes = (blogs) => {
      const likes = blogs.length === 0 ? 0 : blogs.map(blog => blog.likes)
                    .reduce((acc, current) => acc + current)
    return likes
  }

  const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    let mostLikes = 0
    blogs.forEach(blog => {
        mostLikes = blog.likes > mostLikes ? blog.likes : mostLikes
    });
    console.log('mostLikes: ', mostLikes);
    const favorite = blogs.find(blog => blog.likes === mostLikes)
  return {title: favorite.title, author: favorite.author, likes: favorite.likes}
}

// const mostBlogs = (blogs) => {
//     const authors = []
//     blogs.forEach(blog => {
//         for (let i=0; i<)
//         authors.author = blog.author
//         authors
//     });
// }
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
  }