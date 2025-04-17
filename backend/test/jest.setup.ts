import { config } from 'dotenv';
import { join } from 'path';

// Load test environment variables
config({ path: join(__dirname, '../.env.test') });

// Increase test timeout
jest.setTimeout(30000);