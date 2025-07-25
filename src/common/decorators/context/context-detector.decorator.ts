import { ContextType } from './types/enum/context-type.enum'

import {
  HttpContext,
  HttpParams,
  GraphQLContext,
  GraphQLParams,
  SocketServerContext,
  SocketServerParams,
} from './types/context-detector.types'

export class ContextDetector {
  static type: ContextType
  protected static params: any[any]

  private static readonly hasHttpParams = (): boolean => {
    return (
      this.params.length === 3 &&
      'url' in this.params[0] &&
      this.params[this.params.length - 1] instanceof Function
    )
  }

  private static readonly hasGraphQLParams = (): boolean => {
    return this.params.length === 4 && 'fieldName' in this.params[3]
  }

  private static readonly hasSocketServerParams = (): boolean => {
    return (
      (this.params.length === 2 &&
        this.params[this.params.length - 1] instanceof Function) ||
      (this.params.length === 1 && 'handshake' in this.params[0])
    )
  }
  public static readonly hasSocketMiddlewareParams = (): boolean => {
    return (
      typeof this.params[0][0] === 'string' &&
      this.params[this.params.length - 1] instanceof Function
    )
  }
  static readonly detect = (params: any[]) => {
    this.params = params

    const hasHttpParams = this.hasHttpParams()

    const hasGraphQLParams = this.hasGraphQLParams()

    const hasSocketServerParams = this.hasSocketServerParams()

    if (hasHttpParams) {
      this.type = ContextType.httpContext
      return this
    }

    if (hasGraphQLParams) {
      this.type = ContextType.graphContext
      return this
    }

    if (hasSocketServerParams) {
      this.type = ContextType.socketContext
      return this
    }

    throw new Error('Un-known Context')
  }

  static readonly switchToHTTP = <P = any, Q = any>(): HttpContext<P, Q> => {
    const [req, res, next]: HttpParams<P, Q> = this.params

    return { req, res, next }
  }

  static readonly switchToGraphQL = <Args = any>(): GraphQLContext<Args> => {
    const [source, args, context, info]: GraphQLParams<Args> = this.params

    return { source, args, context, info }
  }

  static readonly switchToSocket = (): SocketServerContext => {
    const [socket, socketServerNext]: SocketServerParams = this.params
    return { socket, socketServerNext }
  }
}
