import { IMongoDoc } from './IMongo-doc.interface'
import { ICloudFile } from '../../common/services/upload/interface/cloud-response.interface'
import { MongoId } from '../../common/types/db/db.types'

export interface IUserInputs {
  fullName: string
  username: string

  email: string
  password: string
  confirmPassword: string

  birthDate: Date
  phone: string

  otpCode: string

  bio: string
  isPrivateProfile: boolean
}

export interface IUser
  extends IMongoDoc,
    Omit<IUserInputs, 'confirmPassword' | 'otpCode'> {
  avatar: ICloudFile

  age: number

  tempEmail?: string
  changedCredentialsAt?: Date
  oldPasswords: string[]

  posts: MongoId[]
  totalPosts: number

  savedPosts: MongoId[]
  likedPosts: MongoId[]

  following: MongoId[]
  totalFollowing: number

  followers: MongoId[]
  totalFollowers: number

  viewers: {
    viewer: MongoId
    totalVisits: number
  }[]

  joinedGroups: MongoId[]

  blockedUsers: MongoId[]

  deactivatedAt?: Date
}
