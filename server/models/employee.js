const mongoose = require('mongoose');
const validator = require('validator');

const employeeSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default:20,
        required: true,
        validate(value) {
            if(value < 20) {
                throw new Error('Age must be a atleast 20')
            }
        }
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true,
        validate(value) {
            if(!(validator.isEmail(value))) {
                throw new Error('Email is invalid')
            }
        }
    },
    dob: {
        type: Date
    },
    address: { type: String},
    photo: { type: String}
},{
    timestamps:true
})

employeeSchema.methods.toJSON = function () {
    const user =this;

    const userObject = user.toObject();
    return userObject;
}

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;