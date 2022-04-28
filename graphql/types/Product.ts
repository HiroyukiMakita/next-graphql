import { Context } from '@apollo/client/react/types/types';
import { objectType, extendType, nonNull, stringArg, nullable } from 'nexus';

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

export const CreateProduct = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('createProduct', {
      type: Product,
      args: {
        name: nonNull(stringArg()),
        price: nonNull(stringArg()),
        remarks: nullable(stringArg()),
      },
      resolve(_parent: any, args: any, ctx: Context) {
        return ctx.prisma.product.create({
          data: {
            name: args.name,
            price: args.price,
            remarks: args.remarks,
          },
        });
      },
    });
  },
});
