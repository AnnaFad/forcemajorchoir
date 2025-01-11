CREATE TYPE applicant_status AS ENUM ('New','Fail','Pass');
CREATE TYPE roles AS ENUM ('Conductor', 'Admin');

CREATE TABLE applicants (
  ID serial PRIMARY KEY NOT NULL,
  data_applicant jsonb NOT NULL,
  status  applicant_status  NOT NULL,
  rehersal_ID integer NOT NULL,
  create_at timestamp NOT NULL,
  update_at timestamp
);

CREATE TABLE rehersals (
  ID serial PRIMARY KEY NOT NULL,
  title varchar(400) NOT NULL,
  date_start timestamp NOT NULL,
  days_for_registration integer,
  is_last boolean NOT NULL,
  create_at timestamp NOT NULL,
  update_at timestamp
);

CREATE TABLE choristers (
  ID serial PRIMARY KEY NOT NULL,
  first_name varchar(200) NOT NULL,
  last_name varchar(200) NOT NULL,
  is_conductor boolean NOT NULL,
  description text,
  photo text NOT NULL,
  is_deleted boolean NOT NULL,
  create_at timestamp NOT NULL,
  update_at timestamp
);

CREATE TABLE visitors (
  ID serial PRIMARY KEY NOT NULL,
  data_visitor jsonb NOT NULL,
  event_ID integer NOT NULL,
  create_at timestamp NOT NULL,
  update_at timestamp
);

CREATE TABLE events (
  ID serial PRIMARY KEY NOT NULL,
  name_event varchar(500),
  description text NOT NULL,
  event_time timestamp NOT NULL,
  photo text NOT NULL,
  has_registration bool NOT NULL,
  registration_is_open bool,
  limit_people int,
  date_time_open timestamp,
  hours_for_registration integer,
  is_deleted boolean NOT NULL,
  create_at timestamp NOT NULL,
  update_at timestamp
);

CREATE TABLE news (
  ID serial PRIMARY KEY NOT NULL,
  title varchar(400)  NOT NULL,
  text_news text NOT NULL,
  photo text NOT NULL,
  is_deleted boolean NOT NULL,
  create_at timestamp NOT NULL,
  update_at timestamp
);

CREATE TABLE users (
  ID serial PRIMARY KEY NOT NULL,
  email varchar(100) NOT NULL,
  password_hash varchar(100) NOT NULL,
  role_user roles NOT NULL,
  create_at timestamp NOT NULL,
  update_at timestamp
);

ALTER TABLE visitors ADD FOREIGN KEY (event_ID) REFERENCES events (ID);

ALTER TABLE applicants ADD FOREIGN KEY (rehersal_ID) REFERENCES rehersals (ID);

