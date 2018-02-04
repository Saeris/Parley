import { getUserId } from '@/utilities'

export const drafts = (parent, args, ctx, info) => {
  const id = getUserId(ctx)

  const where = {
    isPublished: false,
    author: {
      id
    }
  }

  return ctx.db.query.posts({ where }, info)
}
