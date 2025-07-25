import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { GuardActivator } from '../can-activate.guard'
import { MongoId } from '../../types/db/db.types'
import { ContextType } from '../../decorators/context/types/enum/context-type.enum'

import {
  GraphQLParams,
  HttpParams,
} from '../../decorators/context/types/context-detector.types'
import { IUser } from '../../../db/interface/IUser.interface'

class UserPrivacyGuard extends GuardActivator {
  protected userId!: MongoId
  protected profileId!: MongoId
  protected following!: MongoId[]
  protected followers!: MongoId[]
  protected isPrivateProfile!: boolean

  canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP()

      const { _id: profileId } = req.profile
      const {
        _id: userId,
        following,
        followers,
        isPrivateProfile,
        totalFollowers,
        totalFollowing,
        totalPosts,
      } = req.user as IUser

      this.userId = userId
      this.profileId = profileId
      this.following = following
      this.followers = followers
      this.isPrivateProfile = isPrivateProfile

      if (!this.isAllowedToView()) {
        req.user = {
          _id: userId,
          isPrivateProfile,
          totalFollowers,
          totalFollowing,
          totalPosts,
        } as IUser

        return true
      }

      return true
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL()

      const { _id: profileId } = context.profile
      const {
        _id: userId,
        following,
        followers,
        isPrivateProfile,
        totalFollowers,
        totalFollowing,
        totalPosts,
      } = context.user as IUser

      this.userId = userId
      this.profileId = profileId
      this.following = following
      this.followers = followers
      this.isPrivateProfile = isPrivateProfile

      if (!this.isAllowedToView()) {
        context.user = {
          _id: userId,
          isPrivateProfile,
          totalFollowers,
          totalFollowing,
          totalPosts,
        } as IUser
        return context
      }

      return context
    }
  }

  protected readonly isAllowedToView = (): boolean => {
    if (this.following.length)
      return this.following.some((followedUser: MongoId) =>
        followedUser.equals(this.profileId),
      )

    if (this.followers.length)
      return this.followers.some((followedUser: MongoId) =>
        followedUser.equals(this.profileId),
      )
    return false
  }
}

export default new UserPrivacyGuard()
