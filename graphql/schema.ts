// Nexus スキーマ
import { GraphQLBigInt, GraphQLDate } from 'graphql-scalars';
import { asNexusMethod, makeSchema } from 'nexus';
import { join } from 'path';
import * as types from './types';

export const schema = makeSchema({
  types: [
    types,
    // graphql/types 以下 の objectType() で BigInt を使うための設定
    asNexusMethod(GraphQLBigInt, 'bigint', 'bigint'),
    // graphql/types 以下 の objectType() で Date を使うための設定
    asNexusMethod(GraphQLDate, 'Date', 'Date'),
  ],
  //  Nexusが生成するファイルの保存先
  outputs: {
    // 型定義ファイルをnode_modules/@types/nexus-typegen/index.d.tsに生成する設定
    typegen: join(
      process.cwd(),
      'node_modules',
      '@types',
      'nexus-typegen',
      'index.d.ts'
    ),
    // GraphQL SDLファイルを graphql/schema.graphql に生成する設定
    schema: join(process.cwd(), 'graphql', 'schema.graphql'),
  },
  // graphql/context.tsファイルを指定する
  contextType: {
    export: 'Context',
    module: join(process.cwd(), 'graphql', 'context.ts'),
  },
});
