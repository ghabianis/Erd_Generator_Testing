import { Field, ObjectType } from "@nestjs/graphql";
// @ts-ignore
// eslint-disable-next-line
import { User } from "../user/user";

@ObjectType()
export class UserInfo implements Partial<User> {
  @Field(() => String)
  username!: string;
  @Field(() => [String])
  roles!: string[];
  @Field(() => String)
  accessToken?: string;
}

export class UserInfoWithSupabase implements Partial<User> {
  @Field(() => String)
  username!: string;
  @Field(() => String)
  email?: string;
  @Field(() => [String])
  roles!: string[];
  @Field(() => String)
  accessToken?: string;
}

export interface User {
  id: string
  app_metadata: {
    provider?: string
    [key: string]: any
  }
  user_metadata: {
    [key: string]: any
  }
  aud: string
  confirmation_sent_at?: string
  recovery_sent_at?: string
  invited_at?: string
  action_link?: string
  email?: string
  phone?: string
  created_at: string
  confirmed_at?: string
  email_confirmed_at?: string
  phone_confirmed_at?: string
  last_sign_in_at?: string
  role?: string
  updated_at?: string
  identities?: UserIdentity[]
}


export interface UserIdentity {
  id: string
  user_id: string
  identity_data: {
    [key: string]: any
  }
  provider: string
  created_at: string
  last_sign_in_at: string
  updated_at?: string
}


export interface ApiError {
  message: string
  status: number
}