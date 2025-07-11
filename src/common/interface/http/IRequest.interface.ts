import { Request } from 'express'
import { IPayload } from '../../utils/security/token/interface/token.interface'
import { IUser } from '../../../db/interface/IUser.interface'
import {
  ICloudFile,
  ICloudFiles,
} from '../../services/upload/interface/cloud-response.interface'
import { IPost } from '../../../db/interface/IPost.interface'
import { IComment } from '../../../db/interface/IComment.interface'

export interface IRequest<P = any, Q = any> extends Request<P, any, any, Q> {
  tokenPayload: IPayload
  profile: IUser
  user: IUser
  post: IPost
  comment: IComment
  cloudFile: ICloudFile
  cloudFiles: ICloudFiles
}
