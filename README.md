This project was generated with [DevFactory] - with supabase

It consists of two packages:

### [Server](./server/README.md)

## Entity with static data

- Add a ts file in server/scripts repository that contains your postgres querries
- Import your file in the seed.ts and loop over it to execute each querry.

### Example

**server/scripts/categorySeed.ts**

```
export  const  modifyUpdatedAtDefaultValue =
'ALTER TABLE "public"."Category" ALTER COLUMN "updatedAt" SET DEFAULT now()';

export  const  modifyIdDefaultValue =
'ALTER TABLE "public"."Category" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()::text';

export  const  addCategoryData =
'INSERT INTO "public"."Category"(label, description) VALUES ' +
"('Comedy', 'Comedy'), " +
"('Animation', 'Animation'), " +
"('Action', 'Action'), " +
"('Crime ', 'Crime'), " +
"('Thriller ', 'Thriller'), " +
"('Mystery ', 'Mystery'), " +
"('Adventure ', 'Adventure'); ";
```

**server/scripts/seed.ts**

```
import  *  as  categorySeed  from  "./categorySeed"

for (const  query  of  Object.values(categorySeed)) {
	await  client.$queryRawUnsafe(query)
}
```
 
## Github-Gitlab Mirror

Mirror generated project's github repo with a gitlab repo.

#### Setup - Github

Create a gitlab repo.

In the github repo, that you will use to sync generated projects of Devfactory, Under the Settings tab, open secrets and create these Actions secrets :

- TARGET_URL : Url of the gitlab repository

- TARGET_USERNAME : Username of gitlab account

- TARGET_TOKEN : Gitlab access token [How to create a gitlab access token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html)

Now the builds of the devfactory project which are synchronized with the configured github repo, git pushes, new branches, etc.. will also appear in the gitlab repo.

- do not delete or edit ".github/workflows/gitlab-sync.yml" file in the generated projects to ensure repo mirroring.

#### Setup - Gitlab



If you want to do the mutual action (Sync github with gitlab), go to the gitlab repo :

Go to Settings -> Repository

Expand "Mirroring repository"

- Enter the Git repository URL :

(https://username@github.com/path-to/repository)

Example :

https://hazem-tekab@github.com/hazem-tekab/test-sync-github.git

- For the password, use a Github access token [How to create a github access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
