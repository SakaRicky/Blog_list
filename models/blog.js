const mongoose = require('mongoose')
let uniqueValidator = require('mongoose-unique-validator');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 10,
        required: true
    },
    author: {
        type: String,
        minlength: 5,
        required: true
    },
    url: {
        type: String,
        minlength: 5,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
  })

blogSchema.plugin(uniqueValidator)

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)