import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";

export default withApiAuthRequired (async function handler(req, res) {
  const { user } = await getSession(req, res);
  const client = await clientPromise;
  const db = client.db("blogAi");
  const userProfile = await db.collection("users").updateOne(
    {
      auth0Id: user.sub,
    },
    {
      $inc: {
        availableTokens: 10,
      },
      $setOnInsert: {
        auth0Id: user.sub,
      },
    },
    {
      upsert: true,
    }
  );
  console.log("User-==", userProfile)
  res.status(200).json({ name: "John Doe" });
})
