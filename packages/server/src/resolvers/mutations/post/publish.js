import { getUserId } from "../../../utilities"

export const publish = async (parent, { id }, ctx, info) => {
  const userId = getUserId(ctx)
  const postExists = await ctx.db.exists.Post({ // eslint-disable-line
    id,
    author: { id: userId }
  })
  if (!postExists) throw new Error(`Post not found or you're not the author`)

  return ctx.db.mutation.updatePost(
    {
      where: { id },
      data: { isPublished: true }
    },
    info
  )
}
