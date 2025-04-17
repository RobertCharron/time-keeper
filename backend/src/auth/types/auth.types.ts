export type JwtPayload = {
  sub: string;
  email: string;
};

export type AuthResponse = {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
};
