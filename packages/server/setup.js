import { writeFileSync, existsSync } from "fs"
import { join } from "path"
import crypto from "crypto"
import envfile from "envfile"

const { info, error } = console

function createSecret() {
  const buffer = crypto.randomBytes(256)
  return buffer.toString(`hex`)
}

function setup() {
  // if a keypair doesn't already exist, create it
  try {
    info(`Beginning server setup...`)
    // if an .env file doesn't already exist, create one from the template
    const env = join(__dirname, `.env`)
    if (existsSync(env)) {
      info(`Environment settings already exist! Skipping...`)
    } else {
      info(`Creating .env file from template...`)
      let defaults = envfile.parseFileSync(`.env.default`)
      defaults.PRISMA_SECRET = createSecret()
      defaults.APP_SECRET = createSecret()
      writeFileSync(`.env`, envfile.stringifySync(defaults))
      info(`Successfully created .env file!`)
    }
    info(`Server setup finished! Run 'yarn start' to start the server!`)
  } catch (err) {
    error(`Server setup failed with the following error:`, err)
  }
}

setup()
