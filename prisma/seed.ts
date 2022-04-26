import { prisma } from '../lib/prisma';
import { faker } from '@faker-js/faker';

const main = async () => {
  await prisma.product.createMany({
    data: [...Array(10)].map((_) => {
      return {
        name: faker.name.findName(),
        price: faker.random.alphaNumeric(50),
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
