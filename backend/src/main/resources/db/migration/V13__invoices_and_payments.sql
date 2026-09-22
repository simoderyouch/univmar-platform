create table customer_invoice (
    id uuid primary key,
    number varchar(40) not null unique,
    order_id uuid not null unique references customer_order(id),
    issue_date date,
    due_date date,
    status varchar(24) not null,
    subtotal numeric(14,2) not null,
    tax_total numeric(14,2) not null,
    transport numeric(14,2) not null,
    grand_total numeric(14,2) not null,
    notes text,
    created_at timestamp with time zone not null,
    issued_at timestamp with time zone,
    voided_at timestamp with time zone
);
create index idx_customer_invoice_status on customer_invoice(status);
create index idx_customer_invoice_due_date on customer_invoice(due_date);

create table invoice_payment (
    id uuid primary key,
    invoice_id uuid not null references customer_invoice(id) on delete cascade,
    payment_date date not null,
    amount numeric(14,2) not null check (amount > 0),
    method varchar(30) not null,
    reference varchar(120),
    notes text,
    created_at timestamp with time zone not null
);
create index idx_invoice_payment_invoice on invoice_payment(invoice_id);
