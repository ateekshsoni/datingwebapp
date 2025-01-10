import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    course: { type: String, required: true },
    college: { type: String, required: true },
    religion: { type: String, required: true },
    year: { type: Number, required: true },
    bio: { type: String, required: true },
    description: { type: String, required: true },
    diet: { type: String, enum: ['vegetarian', 'non-vegetarian'], required: true },
    lookingFor: { type: String, enum: ['long-term', 'short-term', 'friendship'], required: true },
    smoker: { type: String, enum: ['yes', 'no'], required: true },
    drinker: { type: String, enum: ['yes', 'no'], required: true },
    communicationPreference: { type: String, enum: ['calling', 'messaging'], required: true },
    interests: [{ type: String }],
    photos: [{ type: String }]
}, {
    timestamps: true
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
