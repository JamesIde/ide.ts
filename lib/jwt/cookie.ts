import { hasCookie } from "cookies-next";
import { useStore } from "../store/userStore";
const [user, setUser] = useStore((state) => [state.user, state.setUser]);
export function checkCookie() {
  const cookie = hasCookie("jid", {
    domain:
      process.env.NODE_ENV === "production" ? "www.jamesaide.com" : "localhost",
  });

  if (!cookie) {
    setUser(null);
    localStorage.removeItem("user");
  }
}
