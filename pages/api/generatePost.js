import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";

import OpenAI from "openai";
export default withApiAuthRequired(async function handler(req, res) {
  const { topic, keywords } = req.body;
  const { user } = await getSession(req, res);
  const client = await clientPromise;
  const db = client.db("blogAi");

  const userProfile = await db.collection('users').findOne({
    auth0Id: user.sub
  })
  if(!userProfile?.availableTokens){
    res.status(403);
    return
  }
  const openai = new OpenAI();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are in SEO friendly blog post generater called BlogStandard. You are desgin to output markdown without frontmatter.",
      },
      {
        role: "user",
        content: `Generate me the blog post on following topic delimited bt triple hyphens: 
          ---
          ${topic}
          ---
          Targeting the following keywords delimited bt triple hyphens:
          ---
          ${keywords}
          ---
          `,
      },
    ],
    store: true,
  });
  const postContent = completion.choices[0].message.content;
  const seoResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are in SEO friendly blog post generater called BlogStandard. You are desgin to output in JSON. Don't include HTML tag in your output",
      },
      {
        role: "user",
        content: `Generate SEO friendly title and SEO friendly meta description for the following blog post.
          ${postContent}
          ---
          The output must be in the following format:
          {
          "title": "sample title",
          "metaDescription: "sample meta description""
          }
          `,
      },
    ],
    response_format: { type: "json_object" },
    store: true,
  });


  const { title, metaDescription } =
    JSON.parse(seoResponse.choices[0].message.content) || {};
  console.log(
    "Messsage====",
    title,
    metaDescription,
    JSON.parse(seoResponse.choices[0].message.content)
  );

  await db.collection('users').updateOne({
    auth0Id: user.sub
  },{
    $inc:{
        availableTokens: -1
    }
  })
  const post = await db.collection('posts').insertOne({
    postContent,
    title,
    metaDescription,
    keywords,
    topic,
    userId: userProfile._id,
    created: new Date()
  })
  console.log("MesssagePOST====", post);

  res.status(200).json({
    postId: post.insertedId,
  });
})
