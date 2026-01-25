# PowerCore Unified Dashboard - Database Schema

This directory contains the database schema for the PowerCore Unified Dashboard.

## Files

- `schema.sql` - Complete database schema with all tables, indexes, triggers, and functions

## Database Setup

### Prerequisites

- PostgreSQL 12+ (recommended: PostgreSQL 14+)
- Database created: `powercore_db` (or configure in `.env.local`)

### Installation

1. **Create the database:**
   ```sql
   CREATE DATABASE powercore_db;
   ```

2. **Run the schema:**
   ```bash
   psql -U postgres -d powercore_db -f database/schema.sql
   ```

   Or using connection string:
   ```bash
   psql $DATABASE_URL -f database/schema.sql
   ```

3. **Verify tables were created:**
   ```sql
   \dt
   ```

## Schema Overview

### Core Tables

- **users** - User accounts (assumed to exist, may need to be created separately)
- **agents** - AI agents available in marketplace
- **skills** - Modular capabilities for agents
- **agent_skills** - Many-to-many relationship for agent skill loadouts
- **user_agents** - User ownership of agents
- **user_skills** - User ownership of skills

### Payment Tables

- **payments** - All payment transactions (Stripe, x402, Crypto, Credits)
- **user_credits** - Internal credits balance
- **subscriptions** - Recurring subscriptions

### Supporting Tables

- **reviews** - User reviews and ratings for agents/skills
- **context_cache** - RLM context compression cache

## Key Features

### Indexes

All tables have appropriate indexes for:
- Foreign key lookups
- Common query patterns (category, rating, date)
- Full-text search (where applicable)

### Triggers

- Auto-update `updated_at` timestamps
- Auto-calculate agent/skill ratings from reviews
- Maintain referential integrity

### Functions

- `update_updated_at_column()` - Updates timestamp on row changes
- `update_agent_stats_after_review()` - Recalculates agent ratings
- `update_skill_stats_after_review()` - Recalculates skill ratings

## Migration Notes

### If Users Table Doesn't Exist

Uncomment the users table creation in `schema.sql`:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Existing Database

If you have an existing database with some of these tables:

1. Use `CREATE TABLE IF NOT EXISTS` (already included)
2. Check for conflicts with existing schema
3. May need to run migrations incrementally

## Environment Variables

Ensure these are set in `.env.local`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/powercore_db
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
```

## Testing

After creating the schema, verify with:

```sql
-- Check table counts
SELECT 
    schemaname,
    tablename,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = tablename) as column_count
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check indexes
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

## Next Steps

After schema is created:

1. Set up database connection in application
2. Create ORM models (if using Prisma, TypeORM, etc.)
3. Implement API endpoints for CRUD operations
4. Add seed data for testing
5. Set up database migrations system
