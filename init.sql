SELECT 'CREATE DATABASE ngcash' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ngcash')\gexec

-- -- public.accounts definition

-- -- Drop table

-- -- DROP TABLE accounts;

-- CREATE TABLE IF NOT EXISTS accounts (
-- 	id varchar NOT NULL,
-- 	created_at timestamp NOT NULL DEFAULT now(),
-- 	updated_at timestamp NOT NULL DEFAULT now(),
-- 	deleted_at timestamp NULL,
-- 	deleted bool NOT NULL DEFAULT false,
-- 	active bool NOT NULL DEFAULT true,
-- 	balance int4 NOT NULL DEFAULT 100,
-- 	CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY (id)
-- );


-- -- public.transactions definition

-- -- Drop table

-- -- DROP TABLE transactions;

-- CREATE TABLE IF NOT EXISTS  transactions (
-- 	id varchar NOT NULL,
-- 	created_at timestamp NOT NULL DEFAULT now(),
-- 	updated_at timestamp NOT NULL DEFAULT now(),
-- 	deleted_at timestamp NULL,
-- 	deleted bool NOT NULL DEFAULT false,
-- 	active bool NOT NULL DEFAULT true,
-- 	debited_account varchar NOT NULL,
-- 	credited_account varchar NOT NULL,
-- 	value int4 NOT NULL,
-- 	status varchar NULL,
-- 	CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY (id),
-- 	CONSTRAINT "FK_0eec9257b64098db52a4f599132" FOREIGN KEY (credited_account) REFERENCES accounts(id)
-- );


-- -- public.users definition

-- -- Drop table

-- -- DROP TABLE users;

-- CREATE TABLE IF NOT EXISTS users (
-- 	id varchar NOT NULL,
-- 	created_at timestamp NOT NULL DEFAULT now(),
-- 	updated_at timestamp NOT NULL DEFAULT now(),
-- 	deleted_at timestamp NULL,
-- 	deleted bool NOT NULL DEFAULT false,
-- 	active bool NOT NULL DEFAULT true,
-- 	username varchar NOT NULL,
-- 	"password" varchar NOT NULL,
-- 	account_id varchar NULL,
-- 	CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id),
-- 	CONSTRAINT "REL_17a709b8b6146c491e6615c29d" UNIQUE (account_id),
-- 	CONSTRAINT "FK_17a709b8b6146c491e6615c29d7" FOREIGN KEY (account_id) REFERENCES accounts(id)
-- );