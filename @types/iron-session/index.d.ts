import "iron-session";
declare module "iron-session" {
  interface IronSessionData {
    user?: {
      sessionId: string;
      userId: string;
    };
  }
}
