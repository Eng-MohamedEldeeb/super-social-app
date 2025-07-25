import joi from 'joi'

import * as DTO from '../dto/notification.dto'

import { generalFields } from '../../../common/validation/general-fields'
import { isValidMongoId } from '../../../common/validation/is-valid'

export const getAllNotificationsValidator = {
  schema: joi
    .object<DTO.IGetNotification>()
    .keys({
      id: generalFields.mongoId.required(),
    })
    .required(),

  http() {
    return {
      params: this.schema.required().messages({
        'any.required': 'notification id param is required',
      }),
    }
  },

  graphQL() {
    return {
      args: this.schema.required().messages({
        'any.required': 'notification id arg is required',
      }),
    }
  },
}

export const deleteNotificationValidator = {
  schema: joi
    .object<DTO.IGetNotification>()
    .keys({
      id: generalFields.mongoId.required(),
    })
    .required(),

  http() {
    return {
      params: this.schema.required().messages({
        'any.required': 'notification id param is required',
      }),
    }
  },

  graphQL() {
    return {
      args: this.schema.required().messages({
        'any.required': 'notification id arg is required',
      }),
    }
  },
}
