# Database Setup Guide

This guide explains how to set up the database for the BabyCollab application in both development and production environments.

## Database Provider

The application uses PostgreSQL as its database provider for both development and production environments. This change was made from the original SQLite setup to ensure compatibility with Vercel's serverless environment.

## Environment Files

The project includes multiple environment files for different purposes:

1. **[.env](file:///C:/Users/prana/OneDrive/Desktop/ch_final/.env)** - Default environment variables (shared between dev and prod)
2. **[.env.local](file:///C:/Users/prana/OneDrive/Desktop/ch_final/.env.local)** - Local development overrides (not committed to git)
3. **[.env.production](file:///C:/Users/prana/OneDrive/Desktop/ch_final/.env.production)** - Production environment variables

## Development Setup Options

### Option 1: Use Production Database (Quick Start)

For quick testing and development, you can use the production database directly:

1. Uncomment the production DATABASE_URL in [.env.local](file:///C:/Users/prana/OneDrive/Desktop/ch_final/.env.local):
   ```
   DATABASE_URL="postgres://5a29de660604b14b251f985af2ffec21e65b094b4c2f4fbbace84ad9757626f3:sk_gczEiDrvZghOtr3VrDpJY@db.prisma.io:5432/postgres?sslmode=require"
   ```

**Note**: This is not recommended for regular development due to security concerns.

### Option 2: Local PostgreSQL Instance (Recommended)

1. Install PostgreSQL if not already installed:
   - On macOS: `brew install postgresql`
   - On Ubuntu: `sudo apt install postgresql postgresql-contrib`
   - On Windows: Download from the official PostgreSQL website

2. Start the PostgreSQL service:
   - On macOS: `brew services start postgresql`
   - On Ubuntu: `sudo systemctl start postgresql`
   - On Windows: Start the PostgreSQL service from Services

3. Create a database user (if needed):
   ```sql
   CREATE USER babycollab WITH PASSWORD 'babycollab';
   ALTER USER babycollab CREATEDB;
   ```

4. Create a development database:
   ```sql
   CREATE DATABASE babycollab_dev OWNER babycollab;
   ```

5. Update the [.env.local](file:///C:/Users/prana/OneDrive/Desktop/ch_final/.env.local) file with the correct connection string:
   ```
   DATABASE_URL="postgresql://babycollab:babycollab@localhost:5432/babycollab_dev"
   ```

6. Run the initial migration:
   ```bash
   npx prisma migrate dev
   ```

7. Seed the database with initial data:
   ```bash
   npm run prisma:seed
   ```

## Production Setup

### Using Prisma Data Platform (Current Setup)

The application is currently configured to use Prisma's Data Platform with the following environment variables:

1. `DATABASE_URL` - Direct PostgreSQL connection
2. `PRISMA_DATABASE_URL` - Prisma Data Proxy connection for enhanced performance

These are already configured in [.env.production](file:///C:/Users/prana/OneDrive/Desktop/ch_final/.env.production).

### Using Vercel Postgres (Alternative)

1. In your Vercel project dashboard, go to the "Storage" tab
2. Click "Create Database"
3. Select "Vercel Postgres"
4. Choose your preferred region
5. Click "Connect"
6. Vercel will automatically set the `DATABASE_URL` environment variable

## Prisma Configuration

The Prisma schema has been updated to use the PostgreSQL provider:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

This configuration works for both development and production environments, with the `DATABASE_URL` environment variable determining the target database.

## Migration Process

### Creating New Migrations

When making changes to the Prisma schema:

1. Update the `prisma/schema.prisma` file
2. Create a new migration:
   ```bash
   npx prisma migrate dev --name migration_name
   ```

### Applying Migrations in Production

In production, migrations are applied using:
```bash
npx prisma migrate deploy
```

This command applies all pending migrations to the production database.

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure PostgreSQL is running
   - Check the connection string in [.env.local](file:///C:/Users/prana/OneDrive/Desktop/ch_final/.env.local)
   - Verify the database service is listening on the correct port

2. **Authentication Failed**
   - Check username and password in the connection string
   - Ensure the user has access to the database
   - Verify the user exists in PostgreSQL

3. **Database Does Not Exist**
   - Create the database using `CREATE DATABASE`
   - Ensure the user has access to the database

4. **Permission Denied**
   - Grant appropriate permissions to the database user
   - Ensure the user is the owner of the database or has necessary privileges

### Useful Commands

1. Connect to PostgreSQL CLI:
   ```bash
   psql -U username -d database_name
   ```

2. List databases:
   ```sql
   \l
   ```

3. Connect to a specific database:
   ```sql
   \c database_name
   ```

4. List tables:
   ```sql
   \dt
   ```

5. Check Prisma schema:
   ```bash
   npx prisma validate
   ```

6. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

## Backup and Recovery

### Creating Backups

For local development:
```bash
pg_dump -U username -d database_name > backup.sql
```

For Prisma Data Platform:
- Backups are handled automatically
- Access through the Prisma Data Platform dashboard

### Restoring Backups

```bash
psql -U username -d database_name < backup.sql
```

## Performance Considerations

1. **Indexes**: The Prisma schema includes necessary indexes for optimal query performance
2. **Connection Pooling**: In production, Prisma's Data Proxy handles connection pooling automatically
3. **Query Optimization**: Use Prisma's query profiling tools to identify slow queries