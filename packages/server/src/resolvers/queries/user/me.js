import { getUserId } from '../../../utilities'

export const me = (parent, args, ctx, info) => {
  const id = getUserId(ctx)
  return ctx.db.query.user({ where: { id } }, info)
}
