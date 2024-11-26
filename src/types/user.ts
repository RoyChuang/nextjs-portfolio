export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user';
  created: string;
  updated: string;
}

export interface UserFormValues {
  email: string;
  name: string;
  avatar?: File | null;
  role: 'admin' | 'user';
  password?: string; // 創建時需要，更新時可選
}
