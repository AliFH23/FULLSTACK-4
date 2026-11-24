-- planning db
-- //user
create table users(
    id serial primary key,
    name varchar(200) not null,
    email varchar(150) unique not null,
    hashed_password varchar(200) not null,
    role varchar(20) not null default 'user' check (role in ('admin', 'user', 'trader')),
    status varchar(20) not null default 'approved' check (status in ('pending', 'approved', 'rejected')),
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
);

create table categories(
    id serial primary key,
    name varchar(30) not null unique,
    description text,
    is_archived boolean default true,
    status varchar(20) not null default 'approved' check (status in ('pending', 'approved', 'rejected')),
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
);

create table products(
    id serial primary key,
    name varchar(200) not null,
    description text,
    price numeric (10, 2) not null,
    stock integer default 0,
    image_url text,
    category_id integer not null, -- category => 1-m
    created_by integer not null, -- user => 1-m
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    foreign key (category_id) references categories(id) on delete restrict,
    foreign key (created_by) references users(id) on delete cascade
);


create table refresh_tokens(
    id serial primary key,
    user_id integer not null references users(id) on delete cascade,
    token_hash varchar(64) not null unique,
    expires_at timestamptz not null,
    created_at timestamptz default current_timestamp
);