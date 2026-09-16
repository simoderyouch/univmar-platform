alter table quotations add column revision_of_id bigint references quotations(id);
alter table quotations add column revision_number integer not null default 1;
create index idx_quotations_revision_of on quotations(revision_of_id);
