export interface UserForm {
  name: string;
  email: string;
  password: string;
  role: "SELLER" | "BUYER" | "ADMIN";
}
