const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: "Duy's success",
        author: "Duy Le",
        url: "nothing",
        likes: 4,
    },
    {
        title: "Binh's AOE",
        author: "Binh Nguyen",
        url: "nothing",
        likes: 5,
    }
]

const randomBlog = {
    title: "willremovethissoon",
    author: "willremovethissoon",
    url: "willremovethissoon",
    likes: 555,
}

const nonExistingId = async () => {
  const blog = new Blog(randomBlog)
  await blog.save()
  await blog.remove()

  return blog.id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, randomBlog
}
