import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const login = async (parent, { email, password }, ctx, info) => {
  const user = await ctx.db.query.user({ where: { email } })
  if (!user) throw new Error(`No such user found for email: ${email}`)

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) throw new Error(`Invalid password`)

  return {
    token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
    user
  }
}
