import {
  findVideoIdByUser,
  updateStats,
  insertStats,
} from "../../lib/db/hasura";
import { verifyToken } from "../../lib/utils";

export default async function stats(req, res) {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(403).send({});
    } else {
      const inputParams = req.method === "POST" ? req.body : req.query;
      const { videoId } = inputParams;
      if (videoId) {
        // const decodedToken = jwt.verify(
        //   token,
        //   process.env.NEXT_PUBLIC_JWT_SECRET
        // );

        const userId = verifyToken(token);
        const findVideo = await findVideoIdByUser(token, userId, videoId);
        const doesStatsExist = findVideo?.length > 0;
        if (req.method === "POST") {
          const { watched = true, favourited } = req.body;
          if (doesStatsExist) {
            // update it
            const response = await updateStats(token, {
              favourited,
              watched,
              userId,
              videoId,
            });
            res.send({ data: response });
          } else {
            // add it
            const response = await insertStats(token, {
              favourited,
              watched,
              userId,
              videoId,
            });
            res.send({ data: response });
          }
        } else {
          if (doesStatsExist) {
            res.send(findVideo);
          } else {
            res.status(404);
            res.send({ user: null, msg: "Video not found" });
          }
        }
      }
    }
  } catch (error) {
    console.error("Error occured /stats", error);
    res.status(500).send({ done: false, error: error.message });
  }
  // if (req.method === "POST") {
  //   try {
  //     const token = req.cookies.token;
  //     if (!token) {
  //       res.status(403).send({});
  //     } else {
  //       const { videoId, watched = true, favourited } = req.body;
  //       if (videoId) {
  //         const decodedToken = jwt.verify(
  //           token,
  //           process.env.NEXT_PUBLIC_JWT_SECRET
  //         );

  //         const userId = decodedToken.issuer;
  //         const findVideo = await findVideoIdByUser(token, userId, videoId);
  //         const doesStatsExist = findVideo?.length > 0;
  //         if (doesStatsExist) {
  //           // update it
  //           const response = await updateStats(token, {
  //             favourited,
  //             watched,
  //             userId,
  //             videoId,
  //           });
  //           res.send({ data: response });
  //         } else {
  //           // add it
  //           const response = await insertStats(token, {
  //             favourited,
  //             watched,
  //             userId,
  //             videoId,
  //           });
  //           res.send({ data: response });
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error occured /stats", error);
  //     res.status(500).send({ done: false, error: error.message });
  //   }
  // } else {
  //   try {
  //     const token = req.cookies.token;
  //     if (!token) {
  //       res.status(403).send({});
  //     } else {
  //       const { videoId } = req.body;
  //       if (videoId) {
  //         const decodedToken = jwt.verify(
  //           token,
  //           process.env.NEXT_PUBLIC_JWT_SECRET
  //         );

  //         const userId = decodedToken.issuer;
  //         const findVideo = await findVideoIdByUser(token, userId, videoId);
  //         const doesStatsExist = findVideo?.length > 0;

  //         if (doesStatsExist) {
  //           res.send(findVideo);
  //         } else {
  //           res.status(404);
  //           res.send({ user: null, msg: "Video not found" });
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error occured /stats", error);
  //     res.status(500).send({ done: false, error: error.message });
  //   }
  // }
}
