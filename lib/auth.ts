import { User } from "../@types/Profile";

export function getTokenFromStorage() {
  const user: User = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    return null;
  }
  const token = user.token;
  return token;
}
