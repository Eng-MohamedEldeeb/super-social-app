import { IGetUserProfileDTO } from '../../../modules/user/dto/user.dto'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import {
  GraphQLParams,
  HttpParams,
} from '../../decorators/context/types/context-detector.types'
import { ContextType } from '../../decorators/context/types/enum/context-type.enum'
import { throwError } from '../../handlers/error-message.handler'
import userRepository from '../../repositories/user.repository'
import { GuardActivator } from '../can-activate.guard'

class UserExistenceGuard extends GuardActivator {
  private readonly userRepository = userRepository

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<
        Pick<IGetUserProfileDTO, 'id'>,
        IGetUserProfileDTO
      >()

      const { user, id: userId } = { ...req.query, ...req.params }
      const { _id: profileId } = req.profile

      const isExistedUser = await this.userRepository.findOne({
        filter: {
          ...(user
            ? {
                $or: [
                  {
                    $and: [
                      { username: { $regex: user } },

                      {
                        deactivatedAt: { $exists: false },
                      },
                    ],
                  },
                  {
                    $and: [
                      { fullName: { $regex: user } },

                      {
                        deactivatedAt: { $exists: false },
                      },
                    ],
                  },
                ],
              }
            : {
                $and: [{ _id: userId }, { deactivatedAt: { $exists: false } }],
              }),
        },
        projection: {
          password: 0,
          oldPasswords: 0,
          phone: 0,
          'avatar.public_id': 0,
        },
        options: { lean: true },
      })

      if (!isExistedUser)
        return throwError({
          msg: "user doesn't exist",
          status: 400,
        })

      if (isExistedUser._id.equals(profileId)) {
        req.user = isExistedUser
        return true
      }

      req.user = isExistedUser

      return true
    }

    if (Ctx.type === ContextType.graphContext) {
      const { args, context } = Ctx.switchToGraphQL<IGetUserProfileDTO>()

      const { user, id: userId } = args
      const { _id: profileId } = context.profile

      const isExistedUser = await this.userRepository.findOne({
        filter: {
          ...(user
            ? {
                $or: [
                  {
                    $and: [
                      { username: { $regex: user } },

                      {
                        deactivatedAt: { $exists: false },
                      },
                    ],
                  },
                  {
                    $and: [
                      { fullName: { $regex: user } },

                      {
                        deactivatedAt: { $exists: false },
                      },
                    ],
                  },
                ],
              }
            : {
                $and: [{ _id: userId }, { deactivatedAt: { $exists: false } }],
              }),
        },
        projection: {
          password: 0,
          oldPasswords: 0,
          phone: 0,
          'avatar.public_id': 0,
        },
        options: { lean: true },
      })

      if (!isExistedUser)
        return throwError({
          msg: "user doesn't exist",
          status: 400,
        })

      if (isExistedUser._id.equals(profileId)) {
        context.user = isExistedUser
        return true
      }

      context.user = isExistedUser

      return true
    }
  }
}

export default new UserExistenceGuard()
