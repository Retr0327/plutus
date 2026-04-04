// Set test environment variables before any module loads.
// The Zod env schema requires these even though better-sqlite3 doesn't use them.
process.env.NODE_ENV = 'test';
process.env.POSTGRES_HOST = 'localhost';
process.env.POSTGRES_PORT = '5432';
process.env.POSTGRES_USER = 'test';
process.env.POSTGRES_PASSWORD = 'test';
process.env.POSTGRES_DB = 'test';
