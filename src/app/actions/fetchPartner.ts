"use server"

import dbConnect from "@/lib/mongodb"
import User from "@/model/User"
import { Partner } from "@/types/partner"


export async function fetchPartner(email: string) {
  await dbConnect()
  const decodedEmail = decodeURIComponent(email)
  const userdetails = await User.find({ email: decodedEmail })
  return userdetails
}


export async function fetchPartnerSingle(email: string): Promise<Partner | null> {
  await dbConnect()
  const decodedEmail = decodeURIComponent(email)
  const userDetails = await User.findOne({ email: decodedEmail })

  if (!userDetails) return null
  return {
    id: userDetails._id?.toString(),
    name: userDetails.name,
    email: userDetails.email,
    age: userDetails.age,
    course: userDetails.course,
    college: userDetails.college,
    year: userDetails.year,
    description: userDetails.description,
    religion: userDetails.religion,
    diet: userDetails.diet,
    lookingFor: userDetails.lookingFor,
    smoker: userDetails.smoker,
    drinker: userDetails.drinker,
    relationshipStatus: userDetails.relationshipStatus,
    communicationPreference: userDetails.communicationPreference,
    photos: userDetails.photos,
    hobby:userDetails.hobby,
    gender:userDetails.gender
  }
}
export async function fetchPartnerMultiple(emails: string[]): Promise<Partner[] | null> {
  await dbConnect();
  let decodedEmails: string[] = emails.map((email) => decodeURIComponent(email));

  const userDetails = await User.find({ email: { $in: decodedEmails } });

  if (!userDetails || userDetails.length === 0) return null;

  return userDetails.map((user) => ({
    id: user._id?.toString(),
    name: user.name,
    email: user.email,
    age: user.age,
    course: user.course,
    college: user.college,
    year: user.year,
    description: user.description,
    religion: user.religion,
    diet: user.diet,
    lookingFor: user.lookingFor,
    smoker: user.smoker,
    drinker: user.drinker,
    relationshipStatus: user.relationshipStatus,
    communicationPreference: user.communicationPreference,
    photos: user.photos,
    hobby:user.hobby,
    gender:user.gender
  }));
}
