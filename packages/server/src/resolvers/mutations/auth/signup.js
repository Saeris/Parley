import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const signup = async (parent, args, ctx, info) => {
  const password = await bcrypt.hash(args.password, 10)
  const user = await ctx.db.mutation.createUser({
    data: { ...args, password }
  })

  return {
    token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
    user
  }
}
