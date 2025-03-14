import {UserProfile} from "./userProfile.interface";

export interface User {
  id: string;
  displayName: string;
  email: string;
  password: string;
  userProfile: UserProfile[];
}
