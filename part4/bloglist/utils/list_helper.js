const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  let favorite = blogs[0]
  for (let i = 1; i < blogs.length; i++) {
    if (blogs[i].likes > favorite.likes) {
      favorite = blogs[i]
    }
  }
  return favorite
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {
      author: null,
      blogs: 0
    }
  }

  const authorCounts = {}
  
  for (let blog of blogs) {
    const author = blog.author 

    if (author in authorCounts) {
    authorCounts[author] += 1
    } else {
    authorCounts[author] = 1
  }
  }

let mostAuthor = null
let maxBlogs = 0

for (const author in authorCounts) {
  const blogs = authorCounts[author]

  if (blogs > maxBlogs) {
    maxBlogs = blogs
    mostAuthor = author
  }
}

return {
  author: mostAuthor,
  blogs: maxBlogs
}
}

const mostLikes = (blogs) => {
  const likesperAuthor = {}
  
  for (const blog of blogs) {
    const author = blog.author
    if (author in likesperAuthor) {
      likesperAuthor[author] += blog.likes
    } else {
      likesperAuthor[author] = blog.likes
    }
  }

  let maxLikes = 0
  let maxAuthor = null

  for (const author in likesperAuthor) {
    if (likesperAuthor[author] > maxLikes) {
      maxLikes = likesperAuthor[author]
      maxAuthor = author
    }
  }

  return {
    author: maxAuthor,
    likes: maxLikes
  }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}