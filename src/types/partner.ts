export interface Partner {
    id: number
    name: string
    email:string
    age: number
    course: string
    college: string
    year: number
    description: string
    religion: string
    diet: 'vegetarian' | 'non-vegetarian'
    lookingFor: 'long-term' | 'short-term' | 'friendship'
    smoker: 'yes' | 'no'
    drinker: 'yes' | 'no'
    relationshipStatus: 'single' | 'other'
    communicationPreference: 'calling' | 'messaging'
    photos: string[]
    hobby:string
    gender:string
}
