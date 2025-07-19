import { sign } from "jsonwebtoken";

export function signAccessTokenFor(userId: string) {
  return sign({ sub: userId }, process.env.JWT_SECRET!, {
    expiresIn: "3d",
  });
}
