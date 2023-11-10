import { CustomerProfile, User, UserInfo, UserRole } from "../../models";

export class UserResponse extends UserInfo {
  public static getUserResponse(user: User, forAdmin = false): UserResponse {
    const response = {
      id: (user._id as string).toString(),
      email: user.email,
      role: user.role,
      verified: user.verified,
      profile: user.profile,
    };

    if (forAdmin && user.role === UserRole.CUSTOMER) {
      const { firstName, lastName } = user.profile as CustomerProfile;
      response.profile = { firstName, lastName } as CustomerProfile;
    }

    return response;
  }

  public static getListOfUsersResponse(users: User[]): UserResponse[] {
    return users
      .filter((user) => user.role !== UserRole.ADMIN)
      .map((user) => this.getUserResponse(user));
  }
}
