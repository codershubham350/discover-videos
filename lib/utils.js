//import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

export async function verifyToken(token) {
  // if (token) {
  //   const decodedToken = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
  //   const userId = decodedToken.issuer;
  //   return userId;
  // }
  // return null;
  try {
    if (token) {
      const verified = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );
      return verified.payload && verified.payload?.issuer;
    }
    return null;
  } catch (err) {
    console.error({ err });
    return null;
  }
}
