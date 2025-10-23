-- Create read-only user for fishon-captain app
-- Run this in fishon-market database (Neon console or psql)

-- Create user with secure password
-- IMPORTANT: Replace 'CHANGE_THIS_PASSWORD' with a secure password!
CREATE USER captain_readonly WITH PASSWORD 'CHANGE_THIS_PASSWORD';

-- Grant connection permission
GRANT CONNECT ON DATABASE neondb TO captain_readonly;

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO captain_readonly;

-- Grant SELECT on all existing tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO captain_readonly;

-- Grant SELECT on all future tables (important!)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO captain_readonly;

-- Explicitly revoke write permissions (safety measure)
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON ALL TABLES IN SCHEMA public FROM captain_readonly;

-- Verify permissions (should only show SELECT)
-- Run this to check:
-- SELECT * FROM information_schema.role_table_grants WHERE grantee = 'captain_readonly';

-- Test connection:
-- psql "postgresql://captain_readonly:YOUR_PASSWORD@ep-divine-paper-a1d9utyj-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
-- Then try: SELECT count(*) FROM "Booking";
