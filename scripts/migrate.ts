#!/usr/bin/env tsx

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { config } from 'dotenv';

// Load environment variables
config();

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not set');
}

async function runMigrations() {
	console.log('🚀 Starting database migration...');
	
	// Create migration client with single connection
	const migrationClient = postgres(process.env.DATABASE_URL!, { max: 1 });
	const db = drizzle(migrationClient);

	try {
		await migrate(db, { migrationsFolder: './migrations' });
		console.log('✅ Database migration completed successfully!');
	} catch (error) {
		console.error('❌ Migration failed:', error);
		process.exit(1);
	} finally {
		await migrationClient.end();
	}
}

runMigrations();
