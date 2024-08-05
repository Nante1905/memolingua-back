-- execute after script-v1

create table restore_token (
    token VARCHAR(130) primary key,
    id_user VARCHAR(10) not null REFERENCES user_profiles(id),
    expiration_date TIMESTAMP with time zone not null
);