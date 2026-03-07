export interface User {
  id: string;
  email: string;
  avatar: string;
  created_at: string;
}

export type LoginInputs = {
  email: string;
  password: string;
};