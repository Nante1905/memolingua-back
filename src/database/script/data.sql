-- admin
INSERT INTO ROLES values 
(default, 'Admin', 'ADM'),
(default, 'User', 'USR');

-- users
-- ADMIN
INSERT INTO user_profiles(lastname, firstname, email, pwd, id_role) values 
('Rakoto', 'Jean', 'admin@memolingua.com', crypt('admin', gen_salt('bf')), 'ROLE01');
-- USER
INSERT INTO user_profiles(lastname, firstname, gender, birthday, email, pwd, id_role) values 
('Rakotondriaka', 'Mialisoa', 0, '2003-07-19', 'mialisoamurielle@gmail.com', crypt('mialisoa', gen_salt('bf')), 'ROLE02'),
('Andriamazaoro', 'Nantenaina', 1, '2003-07-05', 'minoharynantenaina@gmail.com', crypt('nantenaina', gen_salt('bf')), 'ROLE02');