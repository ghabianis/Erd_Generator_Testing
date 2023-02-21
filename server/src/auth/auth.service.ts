import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common";
// @ts-ignore
// eslint-disable-next-line
import { UserService } from "../user/user.service";
import { Credentials, ResetEmailCredential } from "./Credentials";
import { PasswordService } from "./password.service";
import { TokenService } from "./token.service";
import { UserInfo, User, ApiError } from "./UserInfo";
import { EmailResetPasswordCredential, ResetPasswordCredential, UserCredentials, InviteUserByEmailCredential } from "./Credentials";
import axios from 'axios';
import { createClient } from '@supabase/supabase-js'
import { PrismaService } from 'nestjs-prisma';
// @ts-ignore
import { sendEmail_SendinBlue } from 'src/util/sendEmail';




@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    protected readonly prisma: PrismaService,
  ) { }

  async validateUser(
    username: string,
    password: string
  ): Promise<UserInfo | null> {
    const user = await this.userService.findOne({
      where: { username },
    });
    if (user && (await this.passwordService.compare(password, user.password!))) {
      const { roles } = user;
      return { username, roles };
    }
    return null;
  }


  async supabaseLogin(credentials: Credentials) {
    credentials.email = credentials.email.toLowerCase();
    const { data } = await axios.post(
      process.env.KONG_URL + "/auth/v1/token?grant_type=password",
      {
        email: credentials.email,
        password: credentials.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.ANON_KEY as string,
          Authorization: `Bearer ${process.env.SERVICE_ROLE_KEY}`,
        },
      }
    );
    return data;
  }

  async signUp(credentials: UserCredentials): Promise<User | ApiError> {
    if (credentials.role?.toLowerCase() === "service_role" || credentials.role?.toLowerCase() === "admin" || credentials.role?.toLowerCase() === "super-admin") {
      throw new UnauthorizedException(`You can't sign up with the role ${credentials.role}`);
    }
    credentials.email = credentials.email.toLowerCase();
    return await axios.post((process.env.KONG_URL || '') + '/auth/v1/admin/users',
      credentials,
      {
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.ANON_KEY || '',
          'Authorization': `Bearer ${process.env.SERVICE_ROLE_KEY || ''}`
        }
      })
      .then(async response => {
        const authData = await this.supabaseLogin({ email: credentials.email, password: credentials.password });
        return authData;
      })
      .catch(error => {
        return error.response.data;
      });
  }

  async sendEmailToResetPassword(credential: EmailResetPasswordCredential) {
    const supabase = createClient('http://kong:8000', process.env.SERVICE_ROLE_KEY || '')

    const redirectTo = process.env.SITE_URL + '/auth/reset-password';
    const { data, error } = await supabase.auth.api
      .resetPasswordForEmail(credential.email, {
        redirectTo
      })
    if (data) {
      return data;
    } else {
      return error;
    }
  }

  async sendEmail(email: string, emailSubject: string, emailHtmlContent: string, emailTextContent: string) {
    var sendSMTPemail = {
      to: [{
        email: email,
      }],
      sender: {
        email: process.env.SMTP_ADMIN_EMAIL as string,
      },
      textContent: emailTextContent,
      subject: emailSubject,
      htmlContent: emailHtmlContent
    };

    const transport = await sendEmail_SendinBlue(sendSMTPemail)
    return transport;
  }

  async inviteUserByEmail(credential: InviteUserByEmailCredential) {
    // if user is already exist we can't invite him
    const userExist = await this.prisma.user.findFirst({ where: { username: credential.email, roles: { has: 'user' } } })
    if (!userExist) {
      const supabase = createClient(
        "http://kong:8000",
        process.env.SERVICE_ROLE_KEY || ""
      );
      const redirectTo = process.env.SITE_URL + '/auth/password-reset';
      const { data, error } = await supabase.auth.api.generateLink(
        'invite',
        credential.email,
        {
          redirectTo: credential.options?.redirectTo ? credential.options?.redirectTo : redirectTo,
          data: credential.options?.data
        }
      );
      if (data) {
        const actionLinkData = data as any
        await this.userService.update({
          data: {
            ...credential.options?.data,
            roles: "user",
          },
          where: {
            username: credential.email
          }
        })
        try {

          const textContent = `Bonjour, vous êtes invités à nous rejoindre sur la plateforme ${process.env.APP_NAME} : ${actionLinkData.action_link}`
          const subject = 'Join Retchee'
          const htmlContent = `<h1>Bonjour,</h1><p>Vous avez été invité à nous rejoindre sur la plateforme ${process.env.APP_NAME} : <br/> ${actionLinkData.action_link}<p>`

          const transport = await this.sendEmail(credential.email, subject, htmlContent, textContent)
          return transport;

        } catch (error) {
          console.log(error)
          return null
        }
      } else {
        console.log("error ", error)
        throw new BadRequestException("please try again")
      }
    } else {
      console.log("user exist")
      throw new BadRequestException("user already exist")
    }

  }

  async resetPassword(credentials: ResetPasswordCredential) {
    const supabase = createClient('http://kong:8000', process.env.SERVICE_ROLE_KEY || "")
    const { data, error } = await supabase.auth.api
      .updateUser(credentials.access_token, {
        password: credentials.password
      })
    if (data) {
      return data;
    } else {
      return error;
    }
  }

  async changeEmail(credentials: ResetEmailCredential) {
    const supabase = createClient('http://kong:8000', process.env.SERVICE_ROLE_KEY || "")
    // to check for password
    const user = await this.userService.findOne({
      where: { id: credentials.userId },
      select: {
        password: true,
      },
    });
    // to check for email availbility
    const userWithSameNewEmail = await this.userService.findOne({
      where: { username: credentials.email },
      select: {
        username: true,
      },
    });
    if (userWithSameNewEmail) throw new BadRequestException("Email already used!");
    if (user && credentials.password) {
      const validPassword = await this.passwordService.compare(
        credentials.password!,
        user.password!
      );
      if (validPassword) {
        // update email 
        const { data, error } = await supabase.auth.api.updateUserById(credentials.userId, { email: credentials.email, user_metadata: { username: credentials.email } })
        if (data) {
          return data;
        } else {
          return error;
        }
      } else throw new BadRequestException("Wrong password");
    } else throw new BadRequestException("Coudn't find user");
  }
}
