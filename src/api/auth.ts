// API 函數定義
export const authApi = {
  login: async (credentials: { identity: string; password: string }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/collections/users/auth-with-password`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      }
    );

    if (!response.ok) {
      throw new Error('登入失敗');
    }

    return response.json();
  },
};
