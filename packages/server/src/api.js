import { graphqlHapi } from "apollo-server-hapi" // https://github.com/apollographql/apollo-server
// https://www.howtographql.com/advanced/4-security/
import depthLimit from 'graphql-depth-limit' // https://github.com/stems/graphql-depth-limit
import queryComplexity from "graphql-query-complexity" // https://github.com/ivome/graphql-query-complexity
import { importSchema } from 'graphql-import'
import { makeExecutableSchema } from "graphql-tools"
import { GraphQLError } from "graphql"
import { Prisma } from "prisma-binding"
import resolvers from "@/resolvers"
//import * as loaders from "@/loaders"
import { formatError } from "@/utilities"

const schema = makeExecutableSchema({
  typeDefs: importSchema(`./src/schema.graphql`),
  resolvers
})

// GraphQL Caching Examples:
// http://dev.apollodata.com/tools/graphql-tools/connectors.html#DataLoader-and-caching
// https://github.com/apollographql/GitHunt-API/blob/cc67a4506c31310b4ba8d811dda11d258c7d60d6/api/index.js#L67-L73
// https://github.com/apollographql/GitHunt-API/blob/cc67a4506c31310b4ba8d811dda11d258c7d60d6/api/sql/schema.js#L63
// https://github.com/apollographql/GitHunt-API/blob/cc67a4506c31310b4ba8d811dda11d258c7d60d6/api/github/connector.js

export default {
  plugin: graphqlHapi,
  options: {
    path: `/graphql`,
    graphqlOptions: ({ payload }) => {
      info(`Received query:`, payload)
      return {
        schema,
        context: {
          db: new Prisma({
            typeDefs: `src/generated/prisma.graphql`,
            endpoint: PRISMA_ENDPOINT, // the endpoint of the Prisma DB service (value is set in .env)
            secret: PRISMA_SECRET // taken from database/prisma.yml (value is set in .env)
          })
        },
        root_value: schema,
        formatError,
        validationRules: [
          depthLimit(10),
          queryComplexity({
            maximumComplexity: 2000,
            variables: payload?.[0]?.variables || payload?.variables || {},
            onComplete: complexity => { info(`Determined query complexity: ${complexity}`) },
            createError: (max, actual) =>
              new GraphQLError(`Query is too complex: ${actual}. Maximum allowed complexity: ${max}`)
          })
        ],
        tracing: true,
        debug: true
      }
    },
    route: {
      cors: true
    }
  }
}
