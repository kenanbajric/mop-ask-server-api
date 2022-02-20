CREATE TABLE users (
    id UUID NOT NULL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(100) NOT NULL,
    user_password VARCHAR(100) NOT NULL,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    UNIQUE(email)
);

CREATE TABLE question (
    question_uid UUID NOT NULL PRIMARY KEY,
    question_title VARCHAR(20) NOT NULL,
    question_text VARCHAR(100) NOT NULL,
    user_uid UUID REFERENCES user (user_uid) NOT NULL,
);

CREATE TABLE answer (
    answer_uid UUID NOT NULL PRIMARY KEY,
    question_uid REFERENCES question (question_uid) NOT NULL,
    answer_text VARCHAR(100) NOT NULL,
    user_uid UUID REFERENCES user (user_uid) NOT NULL,
);

CREATE TABLE upvotes (
    id SERIAL NOT NULL PRIMARY KEY,
    question_id INT NOT NULL REFERENCES questions (id),
    user_id INT NOT NULL REFERENCES users (id)
);