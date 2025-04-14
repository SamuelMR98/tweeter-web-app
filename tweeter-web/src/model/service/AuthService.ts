import { AuthToken, User } from "tweeter-shared";
import { FakeData } from "tweeter-shared";

export class AuthService {
  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const user = FakeData.instance.firstUser;
    if (!user) throw new Error("Invalid alias or password");
    return [user, FakeData.instance.authToken];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array
  ): Promise<[User, AuthToken]> {
    const user = FakeData.instance.firstUser;
    if (!user) throw new Error("Invalid registration");
    return [user, FakeData.instance.authToken];
  }

  public async logout(authToken: AuthToken): Promise<void> {
    await new Promise((res) => setTimeout(res, 1000));
  }
}