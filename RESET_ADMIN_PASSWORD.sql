-- RUN THIS IN SUPABASE SQL EDITOR TO RESET ADMIN PASSWORD TO 'admin123'

UPDATE admin_users 
SET password_hash = '$2b$10$VcysvHV2jzrvouWKX5m9eOS.oliTDQLbDcXRdclKo0A5fFDa/Vm1q'
WHERE email = 'admin@soeltanmedsos.com';
