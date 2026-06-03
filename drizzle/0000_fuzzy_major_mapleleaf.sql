CREATE TABLE "app_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"setting_key" text NOT NULL,
	"setting_value" text,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "app_settings_setting_key_unique" UNIQUE("setting_key")
);
--> statement-breakpoint
CREATE TABLE "cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid NOT NULL,
	"player_name" text NOT NULL,
	"jersey_no" integer,
	"team" text NOT NULL,
	"card_type" text NOT NULL,
	"minute" integer NOT NULL,
	"is_undone" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid NOT NULL,
	"player_name" text NOT NULL,
	"jersey_no" integer,
	"team" text NOT NULL,
	"goal_type" text DEFAULT 'normal' NOT NULL,
	"minute" integer NOT NULL,
	"is_undone" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "match_timer_state" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid NOT NULL,
	"started_at_unix" bigint,
	"paused_at_unix" bigint,
	"total_paused_ms" bigint DEFAULT 0,
	"is_running" boolean DEFAULT false,
	"current_half" integer DEFAULT 1,
	"half1_started_at_unix" bigint,
	"half2_started_at_unix" bigint,
	"extra_started_at_unix" bigint,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "match_timer_state_match_id_unique" UNIQUE("match_id")
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tournament_id" uuid,
	"match_number" integer NOT NULL,
	"match_date" date NOT NULL,
	"match_time" time NOT NULL,
	"venue" text NOT NULL,
	"referee_name" text,
	"team_a" text NOT NULL,
	"team_b" text NOT NULL,
	"team_a_color" text DEFAULT '#0F8A5F',
	"team_b_color" text DEFAULT '#E74C3C',
	"squad_format" text NOT NULL,
	"match_duration" integer NOT NULL,
	"break_duration" integer NOT NULL,
	"extra_time" integer,
	"score_a" integer DEFAULT 0,
	"score_b" integer DEFAULT 0,
	"status" text DEFAULT 'scheduled' NOT NULL,
	"started_at" timestamp,
	"halftime_at" timestamp,
	"second_half_started_at" timestamp,
	"extra_time_started_at" timestamp,
	"completed_at" timestamp,
	"is_locked" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "penalty_shootout" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid NOT NULL,
	"team" text NOT NULL,
	"player_name" text NOT NULL,
	"jersey_no" integer,
	"kick_number" integer NOT NULL,
	"result" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid NOT NULL,
	"team" text NOT NULL,
	"name" text NOT NULL,
	"jersey_no" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "substitutions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid NOT NULL,
	"team" text NOT NULL,
	"player_out" text NOT NULL,
	"player_in" text NOT NULL,
	"minute" integer NOT NULL,
	"is_undone" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tournament_standings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tournament_id" uuid NOT NULL,
	"team_name" text NOT NULL,
	"played" integer DEFAULT 0,
	"won" integer DEFAULT 0,
	"drawn" integer DEFAULT 0,
	"lost" integer DEFAULT 0,
	"goals_for" integer DEFAULT 0,
	"goals_against" integer DEFAULT 0,
	"goal_difference" integer DEFAULT 0,
	"points" integer DEFAULT 0,
	"head_to_head_pts" integer DEFAULT 0,
	"head_to_head_gd" integer DEFAULT 0,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tournaments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"venue" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_timer_state" ADD CONSTRAINT "match_timer_state_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "penalty_shootout" ADD CONSTRAINT "penalty_shootout_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "substitutions" ADD CONSTRAINT "substitutions_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_standings" ADD CONSTRAINT "tournament_standings_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;