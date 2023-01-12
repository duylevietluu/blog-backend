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

module.exports = {
  dummy,totalLikes,favoriteBlog
}