export interface IPasswordHasher {
  verify(rawPassword: string, hashedPassword: string): Promise<boolean>;
  hash(password: string): Promise<string>;
}
