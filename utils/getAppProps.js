import { getSession } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";
import clientPromise from "../lib/mongodb";
export const getAppProps =async(ctx)=>{
    const { user } = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db("blogAi");
    const userdata = await db.collection("users").findOne({
      auth0Id: user.sub,
    });
    if(!userdata){
        return{
            availableTokens: 0,
            posts:[]
        }
    }

    const posts = await db.collection("posts").find({
      userId: new ObjectId(userdata._id),
    }).sort({
      created: -1
    }).toArray();

    return {
      availableTokens: userdata.availableTokens,
      postId: ctx.params?.postId || null,
      posts: posts.map(({created, _id, userId, ...rest})=>({
        created: created.toString(),
        _id: _id.toString(),
        userId: userId.toString(),
        ...rest,
        
      })) 
    };
}
