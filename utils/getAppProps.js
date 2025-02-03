// import { getSession } from "@auth0/nextjs-auth0";
// import { ObjectId } from "mongodb";
// import clientPromise from "../lib/mongodb";
export const getAppProps =async(ctx)=>{
    // const { user } = await getSession(ctx.req, ctx.res);
    // const client = await clientPromise;
    // const db = client.db("tredence");
    // const userdata = user.sub;
    // if(!userdata){
    //     return{
    //         posts:[]
    //     }
    // }
    // const posts = await db.collection("testcases").find({
    //   userId: userdata,
    // }).sort({
    //   created: -1
    // }).toArray();

    return {
      projects: ["jira", "json", "github"],
    };
}
