const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    // each user are inserted and post 1 blog 
    for (let i = 0; i < helper.initialLen; ++i) {
        // register user
        await api.post("/api/users").send(helper.initialUsers[i])

        // get token from user
        const response = await api.post("/api/login").send(helper.initialUsers[i])
        const token = response.body.token

        helper.initialBlogs[i].token = token
        helper.initialUsers[i].token = token

        // post a blog
        await api
            .post('/api/blogs')
            .send(helper.initialBlogs[i])
            .set('Authorization', 'bearer ' + token)
    }
})

test('blogs are returned as json, and are returned in the right amount', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialLen)
})

test('all blogs have defined ids', async() => {
    const blogs = await helper.blogsInDb()
    blogs.forEach(element => {
        expect(element.id).toBeDefined()
    });
})

test('can add 1 blog to database', async() => {
    const newBlog = helper.randomBlog
    const token = helper.initialUsers[0].token

    await api
        .post("/api/blogs")
        .send(newBlog)
        .set('Authorization', 'bearer ' + token)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter).toHaveLength(1 + helper.initialLen)

    const titles = blogsAfter.map(n => n.title)
    expect(titles).toContain(
        newBlog.title
    )
})

test('blog without likes defaults to 0 likes', async() => {
    const newBlog = {title: "63c021600dc6417d6b3983b1",author: "63c021760dc6417d6b3983b4",url: "63c02523822d884d71704537"}
    const token = helper.initialUsers[0].token

    // no error
    await api
        .post("/api/blogs")
        .set('Authorization', 'bearer ' + token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    // likes = 0
    const blogsAfter = await helper.blogsInDb()
    const addedBlog = blogsAfter.find(blog => blog.title === newBlog.title && blog.author === newBlog.author)
    expect(addedBlog.likes).toBe(0)
})

test('cannot save blog without title or url', async() => {
    const token = helper.initialUsers[0].token

    // without url
    let newBlog = {title: "63c021600dc6417d6b3983b1",author: "63c021760dc6417d6b3983b4"}
    await api
        .post('/api/blogs')
        .set('Authorization', 'bearer ' + token)
        .send(newBlog)
        .expect(400)

    // without title
    newBlog = {url: "63c021600dc6417d6b3983b1",author: "63c021760dc6417d6b3983b4"}
    await api
        .post('/api/blogs')
        .set('Authorization', 'bearer ' + token)
        .send(newBlog)
        .expect(400)
})

test('delete first blog', async() => {
    const blogsBefore = await helper.blogsInDb()
    const firstBlog = blogsBefore[0]
    const token = helper.initialUsers[0].token

    await api
        .delete(`/api/blogs/${firstBlog.id}`)
        .set('Authorization', 'bearer ' + token)
        .expect(204)

    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter).toHaveLength(helper.initialLen - 1)

    const ids = blogsAfter.map(blog => blog.id)
    expect(ids).not.toContain(firstBlog.id)
})

test('update first blog', async() => {
    const blogsBefore = await helper.blogsInDb()
    const firstBlog = blogsBefore[0]
    
    const response = await api.put(`/api/blogs/${firstBlog.id}`).send(helper.randomBlog)
    const newBlog = response.body

    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter).toHaveLength(helper.initialLen)
    expect(newBlog.id).toBe(firstBlog.id)

    const titles = blogsAfter.map(blog => blog.title)
    expect(titles).not.toContain(firstBlog.title)
    expect(titles).toContain(newBlog.title)
})


test('post user successful', async() => {
    const newUser = {
        "username": "48538758347959435987",
        "password": "53578392457834785378",
        "name": "duyvip6a4"
    }

    const response = await api.post('/api/users/').send(newUser)

    expect(response.body.username).toBe(newUser.username)
    expect(response.body.name).toBe(newUser.name)
})

test('post invalid user', async() => {
    // non-unique username
    await api.post('/api/users/').send(helper.initialUsers[0]).expect(400)

    // invalid password
    let newUser = {
        "username": "thanh",
        "password": "",
        "name": "duyvip6a4"
    }
    await api.post('/api/users/').send(newUser).expect(400)

    // invalid username
    newUser = {
        "username": "d",
        "password": "duyvip6a4",
        "name": "duyvip6a4"
    }
    await api.post('/api/users/').send(newUser).expect(400)
})


afterAll(() => {
    mongoose.connection.close()
})