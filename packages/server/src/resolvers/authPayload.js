export const AuthPayload = {
  user: ({ user: { id } }, args, ctx, info) => ctx.db.query.user({ where: { id } }, info)
}
