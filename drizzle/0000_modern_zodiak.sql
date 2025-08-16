CREATE TABLE "auth_tokens" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"provider" varchar(50) NOT NULL,
	"access_token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
