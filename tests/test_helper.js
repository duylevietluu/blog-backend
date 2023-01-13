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

const initialUsers = [
  {
    username: "duyvip6a4",
    name: "duy",
    password: "thisisapassword",
  },
  {
    username: "binhvip6a4",
    name: "binh",
    password: "thisisapassword",
  },
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
  initialBlogs, initialUsers, nonExistingId, blogsInDb, randomBlog
}
