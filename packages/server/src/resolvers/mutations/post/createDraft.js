import { getUserId } from "../../../utilities"

export const createDraft = (parent, { title, text }, ctx, info) => {
  const userId = getUserId(ctx)
  return ctx.db.mutation.createPost(
    {
      data: {
        title,
        text,
        isPublished: false,
        author: {
          connect: { id: userId }
        }
      }
    },
    info
  )
}
