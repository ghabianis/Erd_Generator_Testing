export interface ITokenService {
  createToken: (id: string, username: string, password: string, role: string, firstName: string, lastName: string) => Promise<string>;
}
