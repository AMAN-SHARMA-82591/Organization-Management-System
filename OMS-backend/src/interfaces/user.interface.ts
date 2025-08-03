export interface UserInterface {
  _id: string;
  username: string;
  organization: number | null;
  designation: number | null;
  role: string;
  iat: number;
  exp: number;
}
