import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { ApiError, User, UserInfo } from "./UserInfo";
import { Credentials, EmailResetPasswordCredential, ResetPasswordCredential, UserCredentials, InviteUserByEmailCredential, ResetEmailCredential } from "./Credentials";

@ApiTags("auth")
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('sign_up')
  async signUp(@Body() body: UserCredentials): Promise<User | ApiError> {
    return await this.authService.signUp(body);
  }

  @Post('sign_in')
  async signIn(@Body() body: Credentials): Promise<UserInfo | ApiError> {
    return await this.authService.supabaseLogin(body);
  }

  @Post('send_email_reset_password')
  async sendEmailResetPassword(@Body() body: EmailResetPasswordCredential) {
    return await this.authService.sendEmailToResetPassword(body)
  }

  @Post('reset_password')
  async resetPassword(@Body() body: ResetPasswordCredential) {
    return await this.authService.resetPassword(body)
  }

  @Post('invite_user_by_email')
  async inviteUserByEmail(@Body() body: InviteUserByEmailCredential) {
    return await this.authService.inviteUserByEmail(body)
  }

  @Post('change_email')
  async changeEmail(@Body() body: ResetEmailCredential) {
    return await this.authService.changeEmail(body)
  }
}
