import { asyncHandler } from './async-handler.decorator'
import { ContextDetector } from './context/context-detector.decorator'
import { ContextType } from './enums/async-handler.types'
import { GuardActivator } from '../guards/can-activate.guard'
import { throwGraphError } from '../handlers/graphql/error.handler'
import { throwHttpError } from '../handlers/http/error-message.handler'

export const applyGuards = (...guards: GuardActivator[]) => {
  return asyncHandler(async (...params: any[any]) => {
    const ctx = ContextDetector.detect(params)

    if (ctx.type === ContextType.httpContext) {
      const { req, res, next } = ctx.switchToHTTP()
      for (const guard of guards) {
        const result = await guard.canActivate(req, res, next)
        if (!result)
          return throwHttpError({ msg: 'forbidden request', status: 403 })
      }
      return next()
    }

    if (ctx.type === ContextType.graphContext) {
      const { source, args, context, info } = ctx.switchToGraphQL()

      for (const guard of guards) {
        await guard.canActivate(source, args, context, info)
        if (!context) return throwGraphError('forbidden request')
      }

      return context
    }
  })
}
