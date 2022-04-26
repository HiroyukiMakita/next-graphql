export const resolvers = {
  Query: {
    products: (_parenl: any, _args: any, ctx: any) => {
      return ctx.prisma.product.findMany();
    },
  },
};
