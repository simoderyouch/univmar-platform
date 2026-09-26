create table project_realization_image (
    id uuid primary key,
    project_id uuid not null references customer_project(id) on delete cascade,
    image_url varchar(1000) not null,
    caption varchar(240),
    position integer not null,
    created_at timestamp with time zone not null
);

create index idx_project_realization_image_project on project_realization_image(project_id, position, created_at);
