-- Publish the seeded ERP realizations to the landing portfolio.
insert into website_portfolio_project (id, project_id, category_id, published, featured, sort_order, cover_image_url, created_at, updated_at) values
('45000000-0000-4000-8000-000000000001', '44000000-0000-4000-8000-000000000001', '00000000-0000-0000-0000-000000000051', true, true, 1, '/api/v1/uploads/base-gallery/project-realizations/vasque-pierre-naturelle.jpg', current_timestamp, current_timestamp),
('45000000-0000-4000-8000-000000000002', '44000000-0000-4000-8000-000000000002', '00000000-0000-0000-0000-000000000052', true, true, 2, '/api/v1/uploads/base-gallery/project-realizations/escalier-marbre-led.jpg', current_timestamp, current_timestamp),
('45000000-0000-4000-8000-000000000003', '44000000-0000-4000-8000-000000000003', '00000000-0000-0000-0000-000000000053', true, true, 3, '/api/v1/uploads/base-gallery/project-realizations/cuisine-granit-noir.jpg', current_timestamp, current_timestamp),
('45000000-0000-4000-8000-000000000004', '44000000-0000-4000-8000-000000000004', '00000000-0000-0000-0000-000000000055', true, true, 4, '/api/v1/uploads/base-gallery/project-realizations/patio-pierre-naturelle.jpg', current_timestamp, current_timestamp),
('45000000-0000-4000-8000-000000000005', '44000000-0000-4000-8000-000000000005', '00000000-0000-0000-0000-000000000056', true, true, 5, '/api/v1/uploads/base-gallery/project-realizations/cheminee-travertin.jpg', current_timestamp, current_timestamp);

insert into website_portfolio_project_image (portfolio_project_id, position, image_url) values
('45000000-0000-4000-8000-000000000001', 0, '/api/v1/uploads/base-gallery/project-realizations/vasque-pierre-naturelle.jpg'),
('45000000-0000-4000-8000-000000000002', 0, '/api/v1/uploads/base-gallery/project-realizations/escalier-marbre-led.jpg'),
('45000000-0000-4000-8000-000000000003', 0, '/api/v1/uploads/base-gallery/project-realizations/cuisine-granit-noir.jpg'),
('45000000-0000-4000-8000-000000000004', 0, '/api/v1/uploads/base-gallery/project-realizations/patio-pierre-naturelle.jpg'),
('45000000-0000-4000-8000-000000000005', 0, '/api/v1/uploads/base-gallery/project-realizations/cheminee-travertin.jpg');
