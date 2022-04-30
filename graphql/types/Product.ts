import { Context } from '@apollo/client/react/types/types';
import {
  objectType,
  extendType,
  nonNull,
  stringArg,
  nullable,
  arg,
} from 'nexus';

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
      type: Product,
      resolve(_parent: any, _args: any, ctx: any) {
        return ctx.prisma.product.findMany();
      },
    });
  },
});

export const ProductFindByIdQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('productFindById', {
      type: Product,
      args: {
        id: nonNull(arg({ type: 'BigInt' })),
      },
      resolve(_parent: any, args: any, ctx: any) {
        return ctx.prisma.product.findUnique({
          where: {
            id: args.id,
          },
        });
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

export const UpdateProduct = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('updateProduct', {
      type: Product,
      args: {
        id: nonNull(arg({ type: 'BigInt' })),
        name: nonNull(stringArg()),
        price: nonNull(stringArg()),
        remarks: nullable(stringArg()),
      },
      resolve(_parent: any, args: any, ctx: Context) {
        return ctx.prisma.product.update({
          where: {
            id: args.id,
          },
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

export const DeleteProductMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nullable.field('deleteProduct', {
      type: Product,
      args: {
        id: nonNull(arg({ type: 'BigInt' })),
      },
      resolve(_parent: any, args: any, ctx: Context) {
        return ctx.prisma.product.delete({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});
