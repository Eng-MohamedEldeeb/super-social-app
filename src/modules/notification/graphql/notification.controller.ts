import {
  IMutationController,
  IQueryController,
} from '../../../common/interface/IGraphQL.interface'

import { applyResolver } from '../../../common/decorators/resolver/apply-resolver.decorator'
import { returnedResponseType } from '../../../common/decorators/resolver/returned-type.decorator'
import { NotificationResponse } from './types/notification-response.type'
import { validate } from '../../../common/middlewares/validation/validation.middleware'

import * as resolvers from './notification.resolver'
import * as args from './types/notification-args.type'
import * as validators from '../validators/notification.validators'

import isAuthenticatedGuard from '../../../common/guards/auth/is-authenticated.guard'
import isAuthorizedGuard from '../../../common/guards/auth/is-authorized.guard'
import notificationExistenceGuard from '../../../common/guards/notification/notification-authorization.guard'
import notificationAuthorizationGuard from '../../../common/guards/notification/notification-authorization.guard'

export class NotificationController {
  protected static readonly NotificationQueryResolver =
    resolvers.NotificationQueryResolver
  protected static readonly NotificationMutationResolver =
    resolvers.NotificationMutationResolver

  // Queries:
  static readonly getAllNotifications = (): IQueryController => {
    return {
      type: returnedResponseType({
        name: 'getAllNotifications',
        data: NotificationResponse.getAllNotifications(),
      }),
      resolve: applyResolver({
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          notificationExistenceGuard,
        ],
        resolver: this.NotificationQueryResolver.getAllNotifications,
      }),
    }
  }

  // Mutations:
  static readonly deleteNotification = (): IMutationController => {
    return {
      type: returnedResponseType({
        name: 'deleteNotification',
      }),
      args: args.deleteNotification,
      resolve: applyResolver({
        middlewares: [
          validate(validators.deleteNotificationValidator.graphQL()),
        ],
        guards: [
          isAuthenticatedGuard,
          isAuthorizedGuard,
          notificationExistenceGuard,
          notificationAuthorizationGuard,
        ],
        resolver: this.NotificationMutationResolver.deleteNotification,
      }),
    }
  }
}
