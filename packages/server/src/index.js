import { GraphQLServer } from "graphql-yoga"
import { Prisma } from "prisma-binding"
import resolvers from "./resolvers"

const server = new GraphQLServer({
  typeDefs: `src/schema.graphql`,
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: `src/generated/prisma.graphql`,
      endpoint: PRISMA_ENDPOINT, // the endpoint of the Prisma DB service (value is set in .env)
      secret: PRISMA_SECRET, // taken from database/prisma.yml (value is set in .env)
      debug: true // log all GraphQL queries & mutations
    })
  })
})

server.start(() => log(`Server is running on http://localhost:4000`))
