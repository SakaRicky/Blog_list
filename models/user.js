const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 3
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minLength: 3
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
}
)

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString(),
        delete returnedObject._id
        delete returnedObject.__v

    }
})

const model = mongoose.model('User', userSchema)

module.exports = model