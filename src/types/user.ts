export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  roleId: string;
  created: string;
  updated: string;
}

export interface UserFormValues {
  name: string;
  email: string;
  password?: string;
  oldPassword?: string;
  passwordConfirm?: string;
  role?: string;
  roleId?: string;
}
