# next-graphql

This repository is GraphQL example using below libraries.

- [Next.js](https://nextjs.org/) (React flamework)
- [Material-UI](https://mui.com/material-ui/getting-started/installation/) (UI library)
- [Prisma](https://www.prisma.io/) (ORM for Next.js and TypeScript)
- [Nexus](https://nexusjs.org/) (GraphQL API libraries for JS/TS)
- [MariaDB](https://mariadb.org/) (Database provide on Docker)

# Getting started

### 1. Please clone this repository

### 2. Open repository, Change Directory at `docker/`, and create .env from copy .env.example.

And customise `.env` for your settings.

```
$ cd docker
$ cp .env.example .env
```

### 3. Start up Database on Docker using below command

```
$ make
```

Then you will be able to show PHPMyAdmin at [http://localhost:8888](http://localhost:8888)

### 4. Start up Next.js server using below command

```
# yarn
$ yarn dev
```

Then you will be able to show Next.js Application at [http://localhost:3000](http://localhost:3000)

# History of How to Prisma setting and test data seeding.

(I used yarn commands.)

Prisma install and run initialize.

```
$ yarn add prisma
$ yarn prisma init
# be created .env and prisma/
# customised setting of DB for .env and prisma/schema.prisma
```

Add define of model in `prisma/schema.prisma`

```
model Product {
id BigInt @id @default(autoincrement())
name String @db.VarChar(100)
price String @db.VarChar(50)
remarks String? @db.Text
createdAt DateTime @default(now()) @map(name: "created_at")
updatedAt DateTime @updatedAt @map(name: "updated_at")

@@map(name: "products")
}
```

Run migration using below command.

```
$ yarn prisma migrate dev
```

Create only once Prisma client at lib/prisma.ts.

```
/**
 * https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
 */

import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
```

Create seeder at prisma/seed.ts.

```
import { prisma } from '../lib/prisma';
import { faker } from '@faker-js/faker';

const main = async () => {
  await prisma.product.createMany({
    data: [...Array(10)].map((_) => {
      return {
        name: faker.name.findName(),
        price: String(faker.datatype.number({ min: 99, max: 99999 })),
        remarks: faker.random.words(),
      };
    }),
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

And run seeder use below command.

```
$ yarn prisma db seed
```
