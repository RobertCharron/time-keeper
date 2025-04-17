type LoginData = {
  email: string;
  password: string;
};

type AuthResponse = {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to login');
  }

  return response.json();
}