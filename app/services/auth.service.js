import { account, generateID } from "./appwrite";

export class AuthService {
  static async getUser() {
    const res = await account.get();
    return res;
  }

  static async createUser({ email, password, fullName }) {
    const res = await account.create(generateID(), email, password, fullName);
    return res;
  }

  static async login({ email, password }) {
    const res = await account.createEmailPasswordSession(email, password);
    return res;
  }

  static async logout() {
    const res = await account.deleteSession("current");
    return res;
  }
}
