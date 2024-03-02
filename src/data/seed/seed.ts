import { createInterface } from 'readline';
import { faker } from '@faker-js/faker';
import { envs } from '../../config';
import { MongoDatabase } from '../mongo/mongo-connection';
import { UserModel, ProductModel } from '../';
import { seedData } from './data';

export type ITags = 'motor' | 'work' | 'mobile' | 'lifestyle';

export interface IProduct {
  name: string;
  sale: boolean;
  price: number;
  tags: ITags[];
  createdAt: Date;
  createdBy?: string;
  image?: string;
}

const randomBetween0AndX = (x: number) => {
  return Math.floor(Math.random() * x);
};

const getRandomBoolean = (): boolean => Math.random() >= 0.5;

const getRandomTags = (n: number) => {
  // Predefined set of tags
  const tags: ITags[] = ['work', 'lifestyle', 'motor', 'mobile'];

  // Array to store randomly generated unique tags
  const randomTags: ITags[] = [];

  while (randomTags.length < n) {
    // Generate a random position within the predefined set of tags
    const randomPos = Math.floor(Math.random() * tags.length);

    // Check if the generated tag is not already in the result array
    if (!randomTags.includes(tags[randomPos])) {
      // Add the random tag to the result array
      randomTags.push(tags[randomPos]);
    }
  }

  return randomTags;
};

const generateProducts = (n: number) => {
  // Delete existing products created by the user

  let products: IProduct[] = [];

  // Generate and add 'n' products to the array
  for (let i = 0; i < n; i++) {
    const name = faker.commerce.product();
    const image = faker.image.urlLoremFlickr({
      width: 333,
      height: 250,
      category: name,
    });
    const price = Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
    const sale = getRandomBoolean();
    const tags = getRandomTags(Math.floor(Math.random() * 4) + 1);
    const createdAt = new Date();
    const product = { name, sale, price, image, tags, createdAt };
    products.push(product);
  }

  return products;
};

const confirmationQuestion = (text: string) => {
  return new Promise((resolve) => {
    // conectar readline con la consola
    const ifc = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    ifc.question(text, (res) => {
      ifc.close();
      resolve(res.toLowerCase() === 'yes' || res.toLowerCase() === 'y');
    });
  });
};

(async () => {
  await new Promise((resolve) =>
    resolve(
      MongoDatabase.connect({
        dbName: envs.MONGO_DB_NAME,
        mongoUrl: envs.MONGO_URL,
      })
    )
  );

  const confirmation = await confirmationQuestion(
    'Are you sure do you want to wipe and repopulate the database? (yes/no): '
  );

  if (!confirmation) process.exit();

  await main();

  await MongoDatabase.disconnect();
})();

async function main() {
  const [{ deletedCount: deletedUsers }, { deletedCount: deletedProducts }] =
    await Promise.all([UserModel.deleteMany(), ProductModel.deleteMany()]);

  console.log(`Deleted ${deletedUsers} users, and ${deletedProducts} products`);

  // Create users
  const users = await UserModel.insertMany(seedData.users);

  // Generate random products
  const products = generateProducts(10);

  // Create products
  const newProducts = await ProductModel.insertMany(
    products.map((product) => ({
      ...product,
      createdBy: users[randomBetween0AndX(users.length - 1)].id,
    }))
  );

  console.log(
    `Created ${users?.length} users, and ${products?.length} products`
  );
}
