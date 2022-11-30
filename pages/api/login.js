import { magicAdmin } from "../../lib/magic";
import jwt from "jsonwebtoken";
import { isNewUser, createNewUser } from "../../lib/db/hasura";
import { setTokenCookie } from "../../lib/cookies";

const Login = async (req, res) => {
  if (req.method === "POST") {
    try {
      const auth = req.headers.authorization;
      const didToken = auth ? auth.substr(7) : "";
      console.log({ didToken });
      const metadata = await magicAdmin.users.getMetadataByToken(didToken);
      console.log({ metadata });

      // create jwt
      const token = jwt.sign(
        {
          ...metadata,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
          "https://hasura.io/jwt/claims": {
            "x-hasura-allowed-roles": ["user", "admin"],
            "x-hasura-default-role": "user",
            "x-hasura-user-id": `${metadata.issuer}`,
          },
        },
        process.env.NEXT_PUBLIC_JWT_SECRET
      );
      console.log({ token });

      // CHECK IF USER EXISTS
      const isNewUserQuery = await isNewUser(token, metadata.issuer);
      isNewUserQuery && (await createNewUser(token, metadata));
      setTokenCookie(token, res);
      res.send({ done: true });

      // if (isNewUserQuery) {
      //   // create a new user
      //   const createNewUserMutation = await createNewUser(token, metadata);

      //   // console.log({ createNewUserMutation });
      //   // set the cookie
      //   const cookie = setTokenCookie(token, res);
      //   console.log({ cookie });
      //   res.send({ done: true, msg: "It is a New User" });
      // } else {
      //   // set the cookie
      //   const cookie = setTokenCookie(token, res);
      //   console.log({ cookie });
      //   res.send({ done: true, msg: "Not a New User" });
      // }
    } catch (error) {
      console.error("Something went wrong Logging in", error);
      res.status(500).send({ done: false });
    }
  } else {
    res.send({ done: false });
  }
};

export default Login;
