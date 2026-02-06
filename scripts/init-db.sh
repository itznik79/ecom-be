#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE DATABASE auth_db;
	CREATE DATABASE user_db;
	CREATE DATABASE category_db;
	CREATE DATABASE product_db;
	GRANT ALL PRIVILEGES ON DATABASE auth_db TO postgres;
	GRANT ALL PRIVILEGES ON DATABASE user_db TO postgres;
	GRANT ALL PRIVILEGES ON DATABASE category_db TO postgres;
	GRANT ALL PRIVILEGES ON DATABASE product_db TO postgres;
EOSQL
