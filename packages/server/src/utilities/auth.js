import jwt from "jsonwebtoken"

export class AuthError extends Error {
  constructor() {
    super(`Not authorized`)
  }
}

export const getUserId = ctx => {
  const Authorization = ctx.request.get(`Authorization`)
  if (Authorization) {
    const token = Authorization.replace(`Bearer `, ``)
    const { userId } = jwt.verify(token, APP_SECRET)
    return userId
  }

  throw new AuthError()
}
