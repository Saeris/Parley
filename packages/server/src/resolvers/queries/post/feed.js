export const feed = (parent, args, ctx, info) => ctx.db.query.posts({ where: { isPublished: true } }, info)
