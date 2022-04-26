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
