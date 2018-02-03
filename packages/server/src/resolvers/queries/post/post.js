export const post = (parent, { id }, ctx, info) => ctx.db.query.post({ where: { id } }, info)
