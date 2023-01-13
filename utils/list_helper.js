const dummy = (blogs) => 1

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
            // console.log(sum, item)
        return sum + item.likes
    }
    return blogs.length === 0
        ? 0
        : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (current_max, item) => {
        return (current_max.likes > item.likes)
            ? current_max
            : item
    }

    return blogs.length === 0
        ? undefined
        : blogs.reduce(reducer, blogs[0])
}

const mostBlogs = blogs => {
    if (blogs.length === 0) {
        return undefined
    }

    const authorToBlogs = new Map();

    for (const element of blogs) {
        const old = authorToBlogs.get(element.author)
        if (old) {
            authorToBlogs.set(element.author, 1 + old)
        } else {
            authorToBlogs.set(element.author, 1)
        }
    }

    let maxAuthor = authorToBlogs.keys().next().value
    for (const author of authorToBlogs.keys()) {
        if (authorToBlogs.get(author) > authorToBlogs.get(maxAuthor)) {
            maxAuthor = author
        }
    }

    return {
        author: maxAuthor,
        blogs: authorToBlogs.get(maxAuthor)
    }
}

const mostLikes = blogs => {
    if (blogs.length === 0) {
        return undefined
    }

    const authorToLikes = new Map();

    for (const element of blogs) {
        const old = authorToLikes.get(element.author)
        if (old) {
            authorToLikes.set(element.author, old + element.likes)
        } else {
            authorToLikes.set(element.author, element.likes)
        }
    }

    let maxAuthor = authorToLikes.keys().next().value
    for (const author of authorToLikes.keys()) {
        if (authorToLikes.get(author) > authorToLikes.get(maxAuthor)) {
            maxAuthor = author
        }
    }

    return {
        author: maxAuthor,
        likes: authorToLikes.get(maxAuthor)
    }
}

module.exports = {
  dummy,totalLikes,favoriteBlog,mostBlogs,mostLikes
}