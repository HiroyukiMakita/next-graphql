import { objectType, extendType } from 'nexus';

export const Product = objectType({
  name: 'Product',
  definition(t) {
    t.nonNull.bigint('id');
    t.nonNull.string('name');
    t.nonNull.string('price');
    t.nullable.string('remarks');
    t.nonNull.string('updatedAt');
    t.nonNull.string('createdAt');
  },
});

export const ProductsQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('products', {
      type: 'Product',
      resolve(_parent: any, _args: any, ctx: any) {
        return ctx.prisma.product.findMany();
      },
    });
  },
});
