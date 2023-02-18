CREATE TABLE "users" (
  "uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v1(),
  "name" varchar NOT NULL
);

CREATE TABLE "groups" (
  "uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v1(),
  "name" varchar
);

CREATE TABLE "group_members" (
  "uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v1(),
  "user_id" uuid NOT NULL,
  "group_id" uuid NOT NULL
);

CREATE TABLE "member_rank" (
  "uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v1(),
  "rank_id" uuid NOT NULL,
  "member_id" uuid NOT NULL
);

CREATE TABLE "ranks" (
  "uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v1(),
  "name" varchar NOT NULL,
  "rank_color" varchar NOT NULL
);

CREATE TABLE "team_member_log" (
  "uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v1(),
  "member_id" uuid NOT NULL,
  "team_id" int NOT NULL,
  "team_set_id" uuid NOT NULL
);

CREATE TABLE "team_log_set" (
  "uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v1(),
  "group_id" uuid NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT now()
);

ALTER TABLE "group_members" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("uuid");

ALTER TABLE "group_members" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("uuid");

ALTER TABLE "member_rank" ADD FOREIGN KEY ("rank_id") REFERENCES "ranks" ("uuid");

ALTER TABLE "member_rank" ADD FOREIGN KEY ("member_id") REFERENCES "group_members" ("uuid");

ALTER TABLE "team_member_log" ADD FOREIGN KEY ("member_id") REFERENCES "group_members" ("uuid");

ALTER TABLE "team_member_log" ADD FOREIGN KEY ("team_set_id") REFERENCES "team_log_set" ("uuid");

ALTER TABLE "team_log_set" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("uuid");

CREATE VIEW "group_members_with_ranks" AS
SELECT
  gm.uuid AS "uuid",
  u.uuid AS "user_id",
  u.name AS "user_name",
  r.uuid AS "rank_id",
  r.name AS "rank_name"
FROM "group_members" gm
INNER JOIN "users" u ON u.uuid = gm.user_id
INNER JOIN "member_rank" mr ON mr.member_id = gm.uuid
INNER JOIN "ranks" r ON r.uuid = mr.rank_id;
