"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"
import { UploadButton } from "@/utils/uploadthing"
import { useSession } from "next-auth/react"
import { fetchPartner } from "@/app/actions/fetchPartner"

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z
    .number()
    .min(18, { message: "You must be at least 18 years old." })
    .max(100, { message: "Age must be less than 100." }),
  course: z.string().min(2, { message: "Course is required." }),
  college: z.string().min(2, { message: "College is required." }),
  email: z.string().email(),
  gender: z.enum(["male", "female", "other"]),
  hobby: z.string()
    .min(2, { message: "Hobby is required." })
    .max(15, { message: "Hobby must be at most 15 characters." })
    .regex(/^\w+$/, { message: "Hobby must be a single word." }),

  year: z.number().min(1, { message: "Year is required" }).max(10, { message: "Year must be 10 or less" }),
  religion: z.string().min(2, { message: "Religion is required" }),
  bio: z
    .string()
    .min(4, { message: "Bio must be at least 4 characters." })
    .max(20, { message: "Bio must be less than 20 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." })
    .max(1000, { message: "Description must be less than 1000 characters." }),
  diet: z.enum(["vegetarian", "non-vegetarian"]),
  lookingFor: z.enum(["long-term", "short-term", "friendship"]),
  smoker: z.enum(["yes", "no"]),
  drinker: z.enum(["yes", "no"]),
  relationshipStatus: z.enum(["single", "other"]),
  communicationPreference: z.enum(["calling", "messaging"]),
  photos: z.array(z.string()),
})

const courses = [
  "BBA",
  "MBA",
  "BCA",
  "MCA",
  "LLB",
  "BPT",
  "B.Sc",
  "B.Tech",
  "B.Com",
  "M.Sc",
  "B.A",
  "GNM",
  "LLM",
  "PGDM",
  "BJMC",
  "M.Lib.Sc",
  "Other",
]

const colleges = [
  "renaissnace university",
  "SVVV",
  "medicaps university",
  "Malwa Institute of Technology",
  "prestige university",
  "Other",
]

const hobbies = [
  "Dancing",
  "Singing",
  "Photography",
  "Chess",
  "Cooking",
  "Cricket",
  "Kadabbi",
  "Sketching",
  "Painting",
  "Football",
  "Badmintion",
  "Traveling",
  "Enterprenerenceship",
  "Reading",
  "Writing",
  "Gaming",
  "Other",
]

const religions = ["hindu", "islam", "Jain", "Christian", "Sikh", "Buddh", "Atheist", "other"]

export default function UpdateProfile() {
  const router = useRouter()
  const [photosUrl, setPhotosUrl] = useState<string[]>([])
  const [newPhotosUrl, setNewPhotosUrl] = useState<string[]>([])
  const [interests, setInterests] = useState<string[]>([])
  const [newInterest, setNewInterest] = useState("")
  const { data: session, status } = useSession()
  const [disabledButton, setDisabledButton] = useState<boolean>(false)

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      age: 18,
      email: "",
      gender: "male",
      hobby: "",
      course: "",
      college: "",
      year: 1,
      religion: "",
      bio: "",
      description: "",
      diet: "vegetarian",
      lookingFor: "long-term",
      smoker: "no",
      drinker: "no",
      relationshipStatus: "single",
      communicationPreference: "messaging",
      photos: [],
    },
  })

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "loading") return
      if (!session?.user?.email) {
        toast({
          title: "Error",
          description: "User email not found. Please sign in.",
          variant: "destructive",
        })
        return
      }

      try {
        const userData = await fetchPartner(encodeURIComponent(session.user.email))
        if (userData && userData.length > 0) {
          const user = userData[0]
          form.reset({
            name: user.name || "",
            age: user.age || 18,
            email: user.email || "",
            gender: user.gender || "male",
            hobby: user.hobby || "",
            course: user.course || "",
            college: user.college || "",
            year: user.year || 1,
            religion: user.religion || "",
            bio: user.bio || "",
            description: user.description || "",
            diet: user.diet || "vegetarian",
            lookingFor: user.lookingFor || "long-term",
            smoker: user.smoker || "no",
            drinker: user.drinker || "no",
            relationshipStatus: user.relationshipStatus || "single",
            communicationPreference: user.communicationPreference || "messaging",
            photos: user.photos || [],
          })
          setPhotosUrl(user.photos || [])
          setInterests(user.interests || [])
        } else {
          toast({
            title: "Error",
            description: "User data not found.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchUserData()
  }, [session, status, form])

  const addItem = (newUrl: string) => {
    if (newPhotosUrl.length + photosUrl.length < 3 && newUrl) {
      setNewPhotosUrl((prevItems) => [...prevItems, newUrl])
    } else if (newPhotosUrl.length + photosUrl.length >= 3) {
      toast({
        title: "Limit reached",
        description: "You can only have a total of 3 photos.",
        variant: "destructive",
      })
    }
  }

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setDisabledButton(true)
    try {
      // Use newPhotosUrl if it's not empty, otherwise use the existing photosUrl
      values.photos = newPhotosUrl.length > 0 ? newPhotosUrl : photosUrl
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error("Failed to update profile")

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
      router.push("/home")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      })
    }
    setDisabledButton(false)
  }


  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Update Your Profile</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Your age"
                    {...field}
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Your email" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hobby"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hobby</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your hobby" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {hobbies.map((hobby) => (
                      <SelectItem key={hobby} value={hobby}>
                        {hobby}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="course"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your course" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course} value={course}>
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="college"
            render={({ field }) => (
              <FormItem>
                <FormLabel>College</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your college" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {colleges.map((college) => (
                      <SelectItem key={college} value={college}>
                        {college}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Your year"
                    {...field}
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="religion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Religion</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your religion" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {religions.map((religion) => (
                      <SelectItem key={religion} value={religion}>
                        {religion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Your description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="diet"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Diet</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="vegetarian" />
                      </FormControl>
                      <FormLabel className="font-normal">Vegetarian</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="non-vegetarian" />
                      </FormControl>
                      <FormLabel className="font-normal">Non-Vegetarian</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lookingFor"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Looking For</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="long-term" />
                      </FormControl>
                      <FormLabel className="font-normal">Long-term</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="short-term" />
                      </FormControl>
                      <FormLabel className="font-normal">Short-term</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="friendship" />
                      </FormControl>
                      <FormLabel className="font-normal">Friendship</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="smoker"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Smoker</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yes" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="no" />
                      </FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="drinker"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Drinker</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yes" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="no" />
                      </FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="relationshipStatus"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Relationship Status</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="single" />
                      </FormControl>
                      <FormLabel className="font-normal">Single</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="other" />
                      </FormControl>
                      <FormLabel className="font-normal">Other</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="communicationPreference"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Communication Preference</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="calling" />
                      </FormControl>
                      <FormLabel className="font-normal">Calling</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="messaging" />
                      </FormControl>
                      <FormLabel className="font-normal">Messaging</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="photos"
            render={() => (
              <FormItem>
                <FormLabel>Photos</FormLabel>
                <FormControl>
                  <div className="flex space-x-2">
                    {[...Array(3)].map((_, idx) => (
                      <UploadButton
                        key={idx}
                        className="h-40 w-40"
                        endpoint="imageUploader"
                        disabled={newPhotosUrl.length + photosUrl.length >= 3}
                        onClientUploadComplete={(res) => {
                          if (res && res[0]?.url) addItem(res[0].url)
                        }}
                        onUploadError={(error) => {
                          toast({
                            title: "Upload Error",
                            description: error.message,
                            variant: "destructive",
                          })
                        }}
                      />
                    ))}
                  </div>
                </FormControl>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {newPhotosUrl.map((url, index) => (
                    <img
                      key={index}
                      src={url || "/placeholder.svg"}
                      alt={`Uploaded photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  ))}
                </div>
                <FormLabel>Existing photos</FormLabel>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {photosUrl.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Uploaded photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1"
                        onClick={() => {
                          const updatedPhotos = photosUrl.filter((_, i) => i !== index)
                          setPhotosUrl(updatedPhotos)
                          form.setValue("photos", updatedPhotos)
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
                <FormDescription>Please upload 3 photos of yourself.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={disabledButton}>
            Update Profile
          </Button>
        </form>
      </Form>
    </div>
  )
}