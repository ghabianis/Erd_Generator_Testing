create or replace function requesting_user_id() 
returns text 
language sql stable 
as $$ 
select nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text; 
$$;