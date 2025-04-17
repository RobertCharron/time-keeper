import { NestFactory } from '@nestjs/core';
import { SeedersModule } from './seeders/seeders.module';
import { SeedersService } from './seeders/seeders.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedersModule);
  const seeder = app.get(SeedersService);

  try {
    const result = await seeder.seed();
    console.log('Seeding completed:', result);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
