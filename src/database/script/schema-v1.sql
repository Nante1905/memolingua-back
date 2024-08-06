-- Creation user postgres
create database rde_etech;
create role rde_etech with login encrypted password 'etech'
grant all privilèges on database rde_etech to rde_etech;

-- connect to user rde_etech

create database memolingua;
\c memolingua;
create extension pgcrypto;


CREATE SEQUENCE seq_role;
CREATE TABLE roles(
   id VARCHAR(10) default 'ROLE'||to_char(nextval('seq_role'), 'fm00') primary key,
   label VARCHAR(50)  NOT NULL,
   code VARCHAR(3)  NOT NULL,
   UNIQUE(label),
   UNIQUE(code)
);
CREATE INDEX idx_roles_code on roles(code);

CREATE SEQUENCE seq_langage;
CREATE TABLE langages(
   id VARCHAR(10) default 'LNG'||to_char(nextval('seq_langage'), 'fm0000'),
   label VARCHAR(20)  NOT NULL,
   code VARCHAR(3)  NOT NULL,
   state SMALLINT NOT NULL default 0,
   PRIMARY KEY(id),
   UNIQUE(label),
   UNIQUE(code)
);
CREATE INDEX idx_langage_code on langages(code, state);

create SEQUENCE seq_theme;
CREATE TABLE themes(
   id VARCHAR(10) default 'THM'||to_char(nextval('seq_theme'), 'fm000'),
   label VARCHAR(30)  NOT NULL,
   state SMALLINT NOT NULL default 0,
   PRIMARY KEY(id),
   UNIQUE(label)
);
CREATE INDEX idx_theme_label on themes(label, state);

create SEQUENCE seq_level;
CREATE TABLE levels(
   id VARCHAR(10) default 'LVL'||to_char(nextval('seq_level'), 'fm00'),
   label VARCHAR(20)  NOT NULL,
   min_pts SMALLINT NOT NULL,
   max_pts SMALLINT NOT NULL,
   state SMALLINT not null default 0,
   PRIMARY KEY(id),
   UNIQUE(label)
);
CREATE INDEX idx_level_label on levels(label, state);
CREATE INDEX idx_level_range on levels(min_pts, max_pts, state);

create sequence seq_user;
CREATE TABLE user_profiles(
   id VARCHAR(10) default 'USR'||to_char(nextval('seq_user'), 'fm000000'),
   lastname VARCHAR(50)  NOT NULL,
   firstname VARCHAR(100) ,
   gender SMALLINT,
   birthday DATE,
   email VARCHAR(100)  NOT NULL,
   pwd TEXT NOT NULL,
   avatar_img VARCHAR(200) ,
   id_role VARCHAR(10)  NOT NULL,
   PRIMARY KEY(id),
   UNIQUE(email),
   FOREIGN KEY(id_role) REFERENCES roles(id)
);
CREATE INDEX idx_users_credentials on user_profiles(email, pwd, id_role);

create sequence seq_package;
CREATE TABLE packages(
   id VARCHAR(10) default 'PKG'||to_char(nextval('seq_package'), 'fm000000'),
   title VARCHAR(20)  NOT NULL,
   img_path VARCHAR(255) ,
   state SMALLINT NOT NULL default 0,
   id_theme VARCHAR(10)  NOT NULL,
   id_langage VARCHAR(10)  NOT NULL,
   id_author VARCHAR(10)  NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(id_theme) REFERENCES themes(id),
   FOREIGN KEY(id_langage) REFERENCES langages(id),
   FOREIGN KEY(id_author) REFERENCES user_profiles(id)
);
CREATE INDEX idx_packages_state on packages(state, id_langage);
CREATE INDEX idx_packages_author on packages(state, id_author);


create sequence seq_card;
CREATE TABLE cards(
   id VARCHAR(10) default 'CRD'||to_char(nextval('seq_card'), 'fm0000000'),
   recto VARCHAR(150)  NOT NULL,
   verso VARCHAR(150)  NOT NULL,
   is_public BOOLEAN NOT NULL,
   id_package VARCHAR(10)  NOT NULL,
   id_author VARCHAR(10)  NOT NULL,
   state SMALLINT NOT NULL default 0,
   PRIMARY KEY(id),
   FOREIGN KEY(id_package) REFERENCES packages(id),
   FOREIGN KEY(id_author) REFERENCES user_profiles(id)
);
CREATE INDEX idx_cards_package on cards(id_package);
CREATE INDEX idx_cards_state on cards(state, id_package);


CREATE TYPE media_types AS ENUM ('IMG', 'AUD', 'VID');
create sequence seq_card_media;
CREATE TABLE card_medias(
   id VARCHAR(10) default 'MED'||to_char(nextval('seq_card_media'), 'fm0000000'),
   media_type media_types  NOT NULL,
   media_path VARCHAR(200)  NOT NULL,
   id_card VARCHAR(10)  NOT NULL,
   state SMALLINT not NULL default 0,
   PRIMARY KEY(id),
   FOREIGN KEY(id_card) REFERENCES cards(id)
);
CREATE INDEX idx_cards_media on card_medias(id_card, state);

create sequence seq_users_global_learning; 
CREATE TABLE users_global_learning(
   id VARCHAR(10) default 'GBL'||to_char(nextval('seq_users_global_learning'), 'fm0000000'),
   last_session_date TIMESTAMP WITH TIME ZONE NOT NULL,
   nb_cards SMALLINT NOT NULL,
   timer INTERVAL,
   id_package VARCHAR(10)  NOT NULL,
   id_user VARCHAR(10)  NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(id_package) REFERENCES packages(id),
   FOREIGN KEY(id_user) REFERENCES user_profiles(id)
);
CREATE INDEX idx_users_global_learning on users_global_learning(id_user);

create sequence seq_usr_card_learning;
CREATE TABLE users_card_learning(
   id VARCHAR(10) default 'LRN'||to_char(nextval('seq_usr_card_learning'), 'fm0000000'),
   learning_date TIMESTAMP WITH TIME ZONE NOT NULL default now(),
   difficulty SMALLINT NOT NULL,
   id_card VARCHAR(10)  NOT NULL,
   id_user VARCHAR(10)  NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(id_card) REFERENCES cards(id),
   FOREIGN KEY(id_user) REFERENCES user_profiles(id)
);
create index idx_users_learning on users_card_learning(id_user);

create sequence seq_users_revision;
CREATE TABLE users_revision(
   id VARCHAR(10) default 'REV'||to_char(nextval('seq_users_revision'), 'fm0000000'),
   last_review TIMESTAMP WITH TIME ZONE NOT NULL,
   next_review TIMESTAMP WITH TIME ZONE NOT NULL,
   id_user VARCHAR(10)  NOT NULL,
   id_card VARCHAR(10)  NOT NULL,
   is_done BOOLEAN not null default false,
   PRIMARY KEY(id),
   FOREIGN KEY(id_user) REFERENCES user_profiles(id),
   FOREIGN KEY(id_card) REFERENCES cards(id)
);
create INDEX idx_revision on users_revision(id_user);
create INDEX idx_revision_date on users_revision(next_review);
create INDEX idx_revision_done on users_revision(is_done);


create sequence seq_memory_palace;
CREATE TABLE memory_palace(
   id VARCHAR(10) default 'MEM'||to_char(nextval('seq_memory_palace'), 'fm0000000'),
   img_path VARCHAR(255)  NOT NULL,
   title VARCHAR(30)  NOT NULL,
   state SMALLINT NOT NULL default 0,
   creation_date TIMESTAMP WITH TIME ZONE NOT NULL default now(),
   id_author VARCHAR(10)  NOT NULL,
   PRIMARY KEY(id),
   UNIQUE(title),
   FOREIGN KEY(id_author) REFERENCES user_profiles(id)
);
create index idx_palace_author on memory_palace(id_author, state);

create sequence seq_palace_elements;
CREATE TABLE memory_palace_elements(
   id VARCHAR(20) default 'ELM'||to_char(nextval('seq_palace_elements'), 'fm000000000'),
   numero SMALLINT NOT NULL,
   content VARCHAR(200)  NOT NULL,
   coord_x NUMERIC(4,2)   NOT NULL,
   coord_y NUMERIC(4,2)   NOT NULL,
   id_palace VARCHAR(10)  NOT NULL,
   state SMALLINT NOT NULL default 0,
   PRIMARY KEY(id),
   UNIQUE(id, numero),
   FOREIGN KEY(id_palace) REFERENCES memory_palace(id)
);
create index idx_palace_elements on memory_palace_elements(id_palace, state);

create sequence seq_quiz;
CREATE TABLE quiz(
   id VARCHAR(10) default 'QIZ'||to_char(nextval('seq_quiz'), 'fm0000'),
   title VARCHAR(20)  NOT NULL,
   description VARCHAR(255)  NOT NULL,
   state SMALLINT default 0,
   creation_date TIMESTAMP WITH TIME ZONE NOT NULL default now(),
   id_level VARCHAR(10)  NOT NULL,
   id_theme VARCHAR(10)  NOT NULL,
   img_path VARCHAR(200),
   PRIMARY KEY(id),
   UNIQUE(title, id_level),
   FOREIGN KEY(id_level) REFERENCES levels(id),
   FOREIGN KEY(id_theme) REFERENCES themes(id)
);
create index idx_quiz_criteria on quiz(id_level, state, id_theme);

create sequence seq_question;
CREATE TABLE quiz_question(
   id VARCHAR(10) default 'QST'||to_char(nextval('seq_question'), 'fm000000'),
   question VARCHAR(100)  NOT NULL,
   state SMALLINT NOT NULL default 0,
   id_quiz VARCHAR(10)  NOT NULL,
   PRIMARY KEY(id),
   UNIQUE(question),
   FOREIGN KEY(id_quiz) REFERENCES quiz(id)
);
create index idx_quiz_question on quiz_question(id_quiz, state);

create sequence seq_answer;
CREATE TABLE quiz_correct_answer(
   id VARCHAR(10) default 'ANS'||to_char(nextval('seq_answer'), 'fm0000000'),
   answer VARCHAR(150)  NOT NULL,
   is_correct BOOLEAN NOT NULL,
   state SMALLINT NOT NULL,
   id_question VARCHAR(10) NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(id_question) REFERENCES quiz_question(id)
);
create index idx_answer on quiz_correct_answer(id_question, state);

create sequence seq_user_quiz;
CREATE TABLE user_quiz(
   id VARCHAR(10) default 'UQZ'||to_char(nextval('seq_user_quiz'), 'fm0000000'),
   quiz_date TIMESTAMP WITH TIME ZONE NOT NULL default now(),
   correct_answers SMALLINT NOT NULL default 0,
   total_questions SMALLINT NOT NULL,
   id_user VARCHAR(10)  NOT NULL,
   id_quiz VARCHAR(10)  NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(id_user) REFERENCES user_profiles(id),
   FOREIGN KEY(id_quiz) REFERENCES quiz(id)
);
create index idx_user_quiz on user_quiz(id_user, id_quiz);

create sequence seq_user_answer;
CREATE TABLE user_quiz_answer(
   id VARCHAR(10) default 'UAN'||to_char(nextval('seq_user_answer'), 'fm0000000'),
   answer VARCHAR(100),
   is_correct BOOLEAN NOT NULL,
   id_answer VARCHAR(10),
   id_question VARCHAR(10)  NOT NULL,
   id_user_quiz VARCHAR(10)  NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(id_answer) REFERENCES quiz_correct_answer(id),
   FOREIGN KEY(id_question) REFERENCES quiz_question(id),
   FOREIGN KEY(id_user_quiz) REFERENCES user_quiz(id)
);
create index idx_user_answer on user_quiz_answer(id_user_quiz);

create sequence seq_card_access;
CREATE TABLE cards_access(
   id VARCHAR(10) default 'ACC'||to_char(nextval('seq_card_access'), 'fm0000000'),
   shared_date TIMESTAMP WITH TIME ZONE NOT NULL default now(),
   id_card VARCHAR(10)  NOT NULL,
   id_sharer VARCHAR(10) not null,
   id_receiver VARCHAR(10)  NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(id_card) REFERENCES cards(id),
   FOREIGN KEY(id_sharer) REFERENCES user_profiles(id),
   FOREIGN KEY(id_receiver) REFERENCES user_profiles(id)
);
create index idx_card_shared on cards_access(id_sharer, id_card);
create index idx_card_received on cards_access(id_receiver, id_card);

create sequence seq_notif;
CREATE TABLE notifications(
   id VARCHAR(10) default 'NTF'||to_char(nextval('seq_notif'), 'fm0000000'),
   content VARCHAR(250)  NOT NULL,
   notif_date TIMESTAMP WITH TIME ZONE not null default now(),
   seen_date TIMESTAMP WITH TIME ZONE,
   id_user VARCHAR(10)  NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(id_user) REFERENCES user_profiles(id)
);
create index idx_notif on notifications(id_user, seen_date);


create sequence seq_group;
CREATE TABLE groups(
   id VARCHAR(10) default 'GRP'||to_char(nextval('seq_group'), 'fm00000'),
   name VARCHAR(30)  NOT NULL,
   avatar_path VARCHAR(200) ,
   id_author VARCHAR(10) NOT NULL,
   state SMALLINT not null default 0,
   PRIMARY KEY(id),
   unique(name, id_author),
   FOREIGN KEY(id_author) REFERENCES user_profiles(id)
);
create index idx_group_author on groups(id_author, state);
create index idx_group_name on groups(name, state);

CREATE TABLE group_members(
   id_user VARCHAR(10),
   id_group VARCHAR(10) ,
   invitation_date TIMESTAMP WITH TIME ZONE NOT NULL default now(),
   acceptation_date TIMESTAMP WITH TIME ZONE,
   state SMALLINT not null default 0,
   PRIMARY KEY(id_user, id_group),
   FOREIGN KEY(id_user) REFERENCES user_profiles(id),
   FOREIGN KEY(id_group) REFERENCES groups(id)
);
create index idx_group_members on group_members(id_user, acceptation_date, state);

create sequence seq_group_cards;
CREATE TABLE group_cards(
   id VARCHAR(10) default 'GCD'||to_char(nextval('seq_group_cards'), 'fm0000000'),
   shared_date TIMESTAMP WITH TIME ZONE NOT NULL default now(),
   id_card VARCHAR(10)  NOT NULL,
   id_sharer VARCHAR(10)  NOT NULL,
   id_group VARCHAR(10)  NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(id_card) REFERENCES cards(id),
   FOREIGN KEY(id_sharer) REFERENCES user_profiles(id),
   FOREIGN KEY(id_group) REFERENCES groups(id)
);
create index idx_group_cards on group_cards(id_group);

create sequence seq_group_chat;
CREATE TABLE group_chats(
   id VARCHAR(10) default 'CHT'||to_char(nextval('seq_group_chat'), 'fm000000'),
   created_date TIMESTAMP WITH TIME ZONE NOT NULL default now(),
   id_group VARCHAR(10)  NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(id_group) REFERENCES groups(id)
);
create index idx_group_chat on group_chats(id_group);

create sequence seq_chat_messages;
CREATE TABLE chat_messages(
   id VARCHAR(20) default 'MSG'||to_char(nextval('seq_chat_messages'), 'fm0000000000'),
   content TEXT NOT NULL,
   send_date TIMESTAMP WITH TIME ZONE NOT NULL default now(),
   id_author VARCHAR(10)  NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(id_author) REFERENCES user_profiles(id)
);


