import joi from 'joi'
import {
  ICreatePostDTO,
  IEditPostDTO,
  IGetAllDTO,
  IGetSinglePostDTO,
} from '../dto/post.dto'
import { isValidNumericString } from '../../../common/validation/is-valid'
import { generalFields } from '../../../common/validation/general-fields'

export const getAllValidator = {
  body: joi.object().keys({}),

  query: joi.object<IGetAllDTO>().keys({
    page: joi.string().custom(isValidNumericString('page')).messages({
      'string.base': 'enter a valid page number',
    }),
    limit: joi.string().custom(isValidNumericString('limit')).messages({
      'string.base': 'enter a valid limit number',
    }),
  }),
}

export const getSingleValidator = {
  params: joi
    .object<IGetSinglePostDTO>()
    .keys({
      id: generalFields.mongoId.required(),
    })
    .required()
    .messages({
      'any.required': 'editPost id param is required',
    }),
}

export const createValidator = {
  body: joi
    .object<ICreatePostDTO>()
    .keys({
      title: generalFields.content.min(1).required(),
      content: generalFields.content.max(500),
      onGroup: generalFields.mongoId,
    })
    .required()
    .messages({
      'any.required': 'confirmEmail body is required',
    }),
}

export const editValidator = {
  body: joi
    .object<IEditPostDTO>()
    .keys({
      title: generalFields.content.min(1).when(joi.ref('content'), {
        is: joi.exist(),
        then: joi.optional(),
        otherwise: joi.required(),
      }),
      content: generalFields.content.max(500),
    })
    .required()
    .messages({
      'any.required': 'editPost body is required',
    }),

  query: joi
    .object<IGetSinglePostDTO>()
    .keys({
      id: generalFields.mongoId.required(),
    })
    .required()
    .messages({
      'any.required': 'editPost id param is required',
    }),
}

export const archiveValidator = {
  query: joi
    .object<IGetSinglePostDTO>()
    .keys({
      id: generalFields.mongoId.required(),
    })
    .required()
    .messages({
      'any.required': 'archivePost id query param is required',
    }),
}

export const restoreValidator = {
  query: joi
    .object<IGetSinglePostDTO>()
    .keys({
      id: generalFields.mongoId.required(),
    })
    .required()
    .messages({
      'any.required': 'restorePost id query param is required',
    }),
}

export const deleteValidator = {
  params: joi
    .object<IGetSinglePostDTO>()
    .keys({
      id: generalFields.mongoId.required(),
    })
    .required()
    .messages({
      'any.required': 'deletePost id param is required',
    }),
}
