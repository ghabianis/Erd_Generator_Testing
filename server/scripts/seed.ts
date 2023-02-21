import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { Salt, parseSalt } from "../src/auth/password.service";
import { addAdmin } from "./addAdmin";
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

if (require.main === module) {
  dotenv.config();

  const { BCRYPT_SALT } = process.env;

  if (!BCRYPT_SALT) {
    throw new Error("BCRYPT_SALT environment variable must be defined");
  }
  const salt = parseSalt(BCRYPT_SALT);

  seed(salt).catch((error) => {
    console.error(error);
    Sentry.captureException(error);
    Sentry.close(2000).then(function () {
      process.exit(1);
    });
  });
}
async function seed(bcryptSalt: Salt) {
  console.info("Seeding database...");

  const client = new PrismaClient();

  const queryAddRoleAdmin =
    "DO\n  $do$\n  BEGIN\n     IF NOT EXISTS (\n        SELECT FROM pg_catalog.pg_roles\n        WHERE  rolname = 'admin') THEN\n        CREATE ROLE \"admin\";\n     END IF;\n  END\n  $do$;";
  await client.$queryRawUnsafe(queryAddRoleAdmin);

  const queryGRANTUsageToAdmin = 'GRANT USAGE ON SCHEMA public TO "admin"';
  await client.$queryRawUnsafe(queryGRANTUsageToAdmin);

  const queryGRANTPRIVILEGESTABLESToAdmin =
    'GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public to "admin"';
  await client.$queryRawUnsafe(queryGRANTPRIVILEGESTABLESToAdmin);

  const queryGRANTPRIVILEGESSEQUENCESToAdmin =
    'GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "admin"';
  await client.$queryRawUnsafe(queryGRANTPRIVILEGESSEQUENCESToAdmin);

  const queryAddRoleUser =
    "DO\n  $do$\n  BEGIN\n     IF NOT EXISTS (\n        SELECT FROM pg_catalog.pg_roles\n        WHERE  rolname = 'user') THEN\n        CREATE ROLE \"user\";\n     END IF;\n  END\n  $do$;";
  await client.$queryRawUnsafe(queryAddRoleUser);

  const queryGRANTUsageToUser = 'GRANT USAGE ON SCHEMA public TO "user"';
  await client.$queryRawUnsafe(queryGRANTUsageToUser);

  const queryGRANTPRIVILEGESTABLESToUser =
    'GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public to "user"';
  await client.$queryRawUnsafe(queryGRANTPRIVILEGESTABLESToUser);

  const queryGRANTPRIVILEGESSEQUENCESToUser =
    'GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "user"';
  await client.$queryRawUnsafe(queryGRANTPRIVILEGESSEQUENCESToUser);

  const queryEnableRowSecurity =
    'alter table public."User" enable row level security';
  await client.$queryRawUnsafe(queryEnableRowSecurity);

  const queryPolicySelect =
    "DO " +
    "$do$ " +
    "BEGIN " +
    "IF NOT EXISTS ( " +
    "SELECT FROM pg_catalog.pg_policies " +
    "WHERE  policyname = 'Public users are viewable by everyone.') THEN " +
    'create policy "Public users are viewable by everyone." on public."User" for select using ( true );' +
    "END IF; " +
    "END " +
    "$do$; ";
  await client.$queryRawUnsafe(queryPolicySelect);

  const queryPolicyInsert =
    "DO " +
    "$do$ " +
    "BEGIN " +
    "IF NOT EXISTS ( " +
    "SELECT FROM pg_catalog.pg_policies " +
    "WHERE  policyname = 'Users can insert their own users.') THEN " +
    'create policy "Users can insert their own users." on public."User" for insert with check ( auth.uid()::text = id );' +
    "END IF; " +
    "END " +
    "$do$; ";
  await client.$queryRawUnsafe(queryPolicyInsert);

  const queryPolicyUpdate =
    "DO " +
    "$do$ " +
    "BEGIN " +
    "IF NOT EXISTS ( " +
    "SELECT FROM pg_catalog.pg_policies " +
    "WHERE  policyname = 'Users can update own users or update invited not valid users') THEN " +
    'create policy "Users can update own users or update invited not valid users" on public."User" for update using (((select invited_at from auth.users as au where au.id::text = "User".id and "User"."isValid" = false) is not null ) OR (auth.uid()::text = id));' +
    "END IF; " +
    "END " +
    "$do$; ";
  await client.$queryRawUnsafe(queryPolicyUpdate);

  const queryPolicySelectId =
    "DO " +
    "$do$ " +
    "BEGIN " +
    "IF NOT EXISTS ( " +
    "SELECT FROM pg_catalog.pg_policies " +
    "WHERE  policyname = 'Users are viewable by users who created them.') THEN " +
    'create policy "Users are viewable by users who created them." on public."User" for select using ( auth.uid()::text = id );' +
    "END IF; " +
    "END " +
    "$do$; ";
  await client.$queryRawUnsafe(queryPolicySelectId);

  // create function that insert new row into  public.User
  const queryFunctionAddUser =
    'CREATE OR REPLACE FUNCTION public.handle_new_user()\n  RETURNS trigger\n  LANGUAGE \'plpgsql\'\n  COST 100\n  VOLATILE NOT LEAKPROOF SECURITY DEFINER\n  SET search_path=public\nAS $$\n  begin\n  IF (new.raw_app_meta_data->>\'provider\' = \'email\') then\n    IF (((new.invited_at is not null) and (old.last_sign_in_at is null)) OR (length(new.encrypted_password) <= 0)) then\n      insert into public."User" (id,"createdAt","updatedAt",username,roles, "firstName", "lastName")\n      values (new.id::text,new.created_at,new.updated_at,new.email,ARRAY[new.role], new.raw_user_meta_data->>\'firstName\', new.raw_user_meta_data->>\'lastName\')\n      ON CONFLICT (id)\n      DO\n      UPDATE SET "createdAt" = new.created_at,"updatedAt" = new.updated_at,username = new.email,roles = ARRAY[new.role], "firstName" = new.raw_user_meta_data->>\'firstName\',"lastName" = new.raw_user_meta_data->>\'lastName\';\n    ELSE\n      insert into public."User" (id,"createdAt","updatedAt",username,password,roles, "firstName", "lastName")\n      values (new.id::text,new.created_at,new.updated_at,new.email,new.encrypted_password, ARRAY[new.role], new.raw_user_meta_data->>\'firstName\', new.raw_user_meta_data->>\'lastName\')\n      ON CONFLICT (id)\n      DO\n      UPDATE SET "createdAt" = new.created_at,"updatedAt" = new.updated_at,username = new.email,password = new.encrypted_password,roles = ARRAY[new.role], "firstName" = new.raw_user_meta_data->>\'firstName\',"lastName" = new.raw_user_meta_data->>\'lastName\';\n    END IF;\n  ELSE \n    IF new.role = \'authenticated\' \n    THEN\n      UPDATE auth.users SET role=\'user\' WHERE id = new.id;\n      new.role := \'user\';\n      RETURN NEW;\n    END IF;\n    insert into public."User" (id,"createdAt","updatedAt","firstName","lastName", username,password,roles)\n    values (new.id::text,new.created_at,new.updated_at,new.raw_user_meta_data->>\'firstName\',new.raw_user_meta_data->>\'lastName\',new.email,new.encrypted_password,ARRAY[new.role])\n    ON CONFLICT (id)\n    DO UPDATE SET "createdAt" = new.created_at,"updatedAt" = new.updated_at, "firstName" = new.raw_user_meta_data->>\'firstName\', "lastName" = new.raw_user_meta_data->>\'lastName\', username = new.email, roles = ARRAY[new.role],password=new.encrypted_password;\n  END IF;\n  return new;\n  end $$;';
  await client.$queryRawUnsafe(queryFunctionAddUser);

  // create function that delete user when delete row from auth.user
  const queryFunctionDeleteUser =
    "create or replace function public.handle_delete_user() " +
    "returns trigger " +
    "language plpgsql " +
    "security definer set search_path = public " +
    "as $$ " +
    "begin " +
    'delete from public."User" where id = old.id::text; ' +
    "return old; " +
    "end; " +
    "$$; ";
  await client.$queryRawUnsafe(queryFunctionDeleteUser);

  const queryTriggerAddUser =
    "create or replace trigger on_auth_user_created " +
    "after insert or update on auth.users " +
    "for each row execute procedure public.handle_new_user() ";

  await client.$queryRawUnsafe(queryTriggerAddUser);

  const queryTriggerDeleteUser =
    "create or replace trigger on_auth_user_deleted " +
    "after delete on auth.users " +
    "for each row execute procedure public.handle_delete_user() ";

  await client.$queryRawUnsafe(queryTriggerDeleteUser);

  const createUser =
    "DO " +
    "$do$ " +
    "BEGIN " +
    "IF NOT EXISTS ( " +
    "SELECT FROM pg_catalog.pg_user " +
    "WHERE  usename = 'user_postgres')Then " +
    "CREATE USER user_postgres WITH LOGIN PASSWORD 'user_postgres'; " +
    "END IF; " +
    "END " +
    "$do$; ";

  await client.$queryRawUnsafe(createUser);
  await client.$queryRawUnsafe(
    "alter user user_postgres with createdb createrole replication"
  );
  await client.$queryRawUnsafe(
    "GRANT ALL PRIVILEGES ON DATABASE postgres to user_postgres"
  );
  await client.$queryRawUnsafe("GRANT USAGE ON SCHEMA public TO user_postgres");
  await client.$queryRawUnsafe(
    "GRANT ALL PRIVILEGES ON SCHEMA public TO user_postgres"
  );
  await client.$queryRawUnsafe(
    "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO user_postgres"
  );
  await client.$queryRawUnsafe(
    "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO user_postgres"
  );

  const queryGRANTSelectAuthUsersToUserPostgres =
    'GRANT SELECT ON auth.users TO "user_postgres"';
  await client.$queryRawUnsafe(queryGRANTSelectAuthUsersToUserPostgres);

  const createRole =
    "DO " +
    "$do$ " +
    "BEGIN " +
    "IF NOT EXISTS ( " +
    "SELECT FROM pg_catalog.pg_roles " +
    "WHERE  rolname = 'user')Then " +
    'create role "user" login noinherit;' +
    "END IF; " +
    "END " +
    "$do$; ";

  await client.$queryRawUnsafe(createRole);
  await client.$queryRawUnsafe('grant "user" to authenticator');
  await client.$queryRawUnsafe('GRANT USAGE ON SCHEMA public TO "user"');
  await client.$queryRawUnsafe(
    'GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "user"'
  );

  const createReqUserFunction =
    "create or replace function requesting_user_id() " +
    "returns text " +
    "language sql stable " +
    "as $$ " +
    "select nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text; " +
    "$$;";
  await client.$queryRawUnsafe(createReqUserFunction);

  const createReqUserRoleFunction =
    "create or replace function requesting_user_role() " +
    "returns text " +
    "language sql stable " +
    "as $$ " +
    "select nullif(current_setting('request.jwt.claims', true)::json->>'role', '')::text; " +
    "$$;";
  await client.$queryRawUnsafe(createReqUserRoleFunction);

  /*
  const setEntityUserColumn =
    "DO $$ " +
    "DECLARE " +
    "t_name VARCHAR; " +
    "c_name VARCHAR; " +
    "v_cnt int; " +
    "c1 CURSOR is ( " +
    "SELECT " +
    "tc.table_name, " +
    "kcu.column_name " +
    "FROM " +
    "information_schema.table_constraints AS tc " +
    "JOIN information_schema.key_column_usage AS kcu " +
    "ON tc.constraint_name = kcu.constraint_name " +
    "AND tc.table_schema = kcu.table_schema " +
    "JOIN information_schema.constraint_column_usage AS ccu " +
    "ON ccu.constraint_name = tc.constraint_name " +
    "AND ccu.table_schema = tc.table_schema " +
    "WHERE tc.constraint_type = 'FOREIGN KEY' AND ccu.table_name='User' AND ccu.table_schema ='public'); " +
    "BEGIN " +
    "OPEN c1; " +
    "LOOP " +
    "FETCH c1 INTO t_name,c_name; " +
    "EXIT when NOT FOUND; " +
    'EXECUTE format(\'ALTER TABLE "public"."%1$s" DISABLE ROW LEVEL SECURITY\',t_name); ' +
    "IF NOT EXISTS ( " +
    "SELECT FROM pg_catalog.pg_policies " +
    "WHERE  policyname = 'tenant_isolation_policy' and tablename = t_name ) THEN " +
    'EXECUTE format(\'CREATE POLICY tenant_isolation_policy ON "public"."%1$s" USING ("%2$s" = requesting_user_id() or requesting_user_role()=\'\'admin\'\')\',t_name,c_name); ' +
    "END IF; " +
    'EXECUTE format(\'ALTER TABLE "public"."%1$s" ALTER COLUMN "%2$s" SET DEFAULT requesting_user_id()\',t_name,c_name); ' +
    'EXECUTE format(\'ALTER TABLE "public"."%1$s" ENABLE ROW LEVEL SECURITY\',t_name); ' +
    "END LOOP; " +
    "CLOSE c1; " +
    "END $$; ";
  
  await client.$queryRawUnsafe(setEntityUserColumn); // if going to use setEntityUserColumn, go to scripts/fixMigration.ts and check file documentation to use properly
  */

  // create function that initialize isValid in User table depends on password
  const queryFunctionIsValidUser =
    'create or replace function public.handle_valid_user()\n    returns trigger\n    language plpgsql\n    security definer set search_path = public\n    as $$ \n    begin\n      IF (new.password is not null and length(new.password) > 0) THEN\n        update public."User" set "isValid" = true where (id = new.id::text and ("isValid" is null or "isValid" = false ));\n      ELSE\n        update public."User" set "isValid" = false where (id = new.id::text and "isValid" is null);\n      END IF; \n      return new;\n    end;\n    $$;';
  await client.$queryRawUnsafe(queryFunctionIsValidUser);

  const queryTriggerValidUser =
    '\n    create or replace trigger handle_valid_user\n    after insert or update on public."User"\n    for each row execute procedure public.handle_valid_user()';
  await client.$queryRawUnsafe(queryTriggerValidUser);

  //add admin user email = admin@gmail.com and password = admin
  await addAdmin();

  client.$disconnect();

  console.info("Seeding database with custom seed...");
  console.info("Seeded database successfully");
}
