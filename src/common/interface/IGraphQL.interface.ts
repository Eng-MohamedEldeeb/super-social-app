import {
  GraphQLFieldConfigArgumentMap,
  GraphQLOutputType,
  GraphQLResolveInfo,
} from 'graphql'

import { IUser } from '../../db/interface/IUser.interface'
import { IPayload } from '../utils/security/token/interface/token.interface'
import { IPost } from '../../db/interface/IPost.interface'
import { GuardActivator } from '../guards/can-activate.guard'
import { IComment } from '../../db/interface/IComment.interface'
import { IReply } from '../../db/interface/IReply.interface'
import { IStory } from '../../db/interface/IStory.interface'
import { IGroup } from '../../db/interface/IGroup.interface'
import {
  INotificationDetails,
  INotifications,
} from '../../db/interface/INotification.interface'

export type ControllerParams = (
  args: any,
  context: IContext,
) => Promise<any> | any

export type ResolverParams = (
  source: any,
  args: any,
  context: IContext,
  info: GraphQLResolveInfo,
) => Promise<any> | any

export interface IResolveArgs {
  resolver: ControllerParams
  guards?: GuardActivator[]
  middlewares?: ResolverParams[]
}

export interface IResolver {
  type: GraphQLOutputType
  resolve: (
    s: any,
    args: any,
    context: IContext,
    info: GraphQLResolveInfo,
  ) => any
}

export interface IQueryController extends IResolver {
  args?: GraphQLFieldConfigArgumentMap
}

export interface IMutationController extends IResolver {
  args: GraphQLFieldConfigArgumentMap
}

export interface ISuccessResponse {
  msg: string
  status?: 200 | 201
  data?: any
}

export interface IContext {
  authorization: string
  tokenPayload: IPayload

  profile: IUser
  user: IUser
  story: IStory
  post: IPost
  comment: IComment
  reply: IReply
  group: IGroup
  notifications: INotifications
  notification: Partial<INotificationDetails>
}
