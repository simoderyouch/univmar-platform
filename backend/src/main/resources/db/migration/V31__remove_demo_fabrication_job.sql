delete from fabrication_material
where fabrication_job_id = (select id from fabrication_job where job_number = 'FAB-DEMO-001');

delete from fabrication_operation
where fabrication_job_id = (select id from fabrication_job where job_number = 'FAB-DEMO-001');

delete from fabrication_job
where job_number = 'FAB-DEMO-001';
