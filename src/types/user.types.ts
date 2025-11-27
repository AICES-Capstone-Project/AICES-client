// types/user.types.ts
export interface LoginProvider {
  authProvider: string;
  providerId: string;
  isActive: boolean;
}

export interface User {
  userId: number;
  email: string;
  roleName: string;
  fullName: string;
  address: string;
  dateOfBirth: string | null;
  avatarUrl: string;
  phoneNumber: string;
  loginProviders: LoginProvider[];
  userStatus: "Unverified" | "Verified" | "Locked";
  createdAt: string;
}

export interface GetUsersResponse {
  users: User[];
  totalPages: number;     // từ BE
  currentPage: number;    // từ BE
  pageSize: number;       // từ BE
  // nếu sau này BE trả thêm totalRecords thì ta dùng trực tiếp.
}

export interface GetUserByIdResponse extends User {}

export interface CreateUserRequest {
  email: string;
  password: string;
  roleId: number;
  fullName: string;
}

export interface UpdateUserRequest {
  email: string;
  password?: string;   // 👈 optional
  roleId: string;
  fullName: string;
}
