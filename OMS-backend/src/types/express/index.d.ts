import { UserInterface } from "interfaces/user.interface";

declare global {
  namespace Express {
    interface Request {
      // uid: string;
      user: UserInterface;
    }
  }
}

export {};
