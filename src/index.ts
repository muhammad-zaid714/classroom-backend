import { db } from './db';
import { demoUsers } from './db/schema';

async function main() {
  try {
    const [created] = await db
      .insert(demoUsers)
      .values({ name: 'John Doe', email: 'john@example.com' })
      .returning();

    console.log('Inserted user:', created);

    const result = await db.select().from(demoUsers);
    console.log('Successfully queried the database:', result);
  } catch (error) {
    console.error('Error querying the database:', error);
  }
}

main();