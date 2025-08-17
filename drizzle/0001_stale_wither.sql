CREATE TABLE "user_favorites" (
	"user_id" uuid NOT NULL,
	"game_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_favorites_user_id_game_id_pk" PRIMARY KEY("user_id","game_id")
);
