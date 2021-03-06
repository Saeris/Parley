import hapi from "hapi" // https://hapijs.com/
import monitor from "@/monitor" // Monitoring and Logging
import api from "@/api" // GraphQL API Endpoint
import playground from "@/playground" // GraphQL Playground Route

const server = new hapi.Server({
  host: `localhost`,
  port: PORT,
  routes: { cors: true }
})

const plugins = [
  monitor,
  api
]

async function setup() {
  info(`Setting up server...`)
  try {
    if (LOCAL) plugins.push(playground)
    await server.register(plugins)
    //server.auth.strategy(`jwt`, `jwt`, authentication)
    info(`Successfully setup server!`)
    if (LOCAL) {
      await server.start()
      info(`Server running at: ${server.info.uri}`)
    }
  } catch (err) {
    error(`Failed to setup server:`, err)
  }
}

let loaded = !module.parent

if (loaded) setup()

export default server
