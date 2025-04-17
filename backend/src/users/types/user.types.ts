export interface UserWithPassword {
  id: string;
  name: string;
  email: string;
  hashedPassword: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type UserWithoutPassword = Omit<UserWithPassword, 'hashedPassword'>;

export const userSelect = {
  id: true,
  name: true,
  email: true,
  hashedPassword: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} as const;

export const userWithoutPasswordSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} as const;
