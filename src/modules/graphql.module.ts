import { GraphQLError, GraphQLObjectType, GraphQLSchema } from 'graphql'
import { createHandler } from 'graphql-http/lib/use/express'

import * as auth from './auth/graphql/auth.module'
import * as profile from './profile/graphql/profile.module'
import * as user from './user/graphql/user.module'
import * as post from './post/graphql/post.module'
import * as comment from './comment/graphql/comment.module'

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'mainRootQuery',
    fields: {
      profile: profile.queryModule,
      user: user.queryModule,
      post: post.queryModule,
      comment: comment.queryModule,
    },
  }),

  mutation: new GraphQLObjectType({
    name: 'mainRootMutation',
    fields: {
      auth: auth.mutationModule,
      profile: profile.mutationModule,
      user: user.mutationModule,
      post: post.mutationModule,
    },
  }),
})

const graphqlModule = createHandler({
  schema,
  context: function (req, _) {
    const { authorization } = req.raw.headers

    return { authorization }
  },
  formatError(err) {
    return new GraphQLError(err.message, { originalError: err })
  },
})

export default graphqlModule
