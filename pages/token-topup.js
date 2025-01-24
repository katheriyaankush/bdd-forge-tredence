import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import AppLayout from "../Components/AppLayout/AppLayout";
import { useState } from "react";
import {getAppProps} from '../utils/getAppProps'

  export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(ctx){
      const props =  await getAppProps(ctx);
      return {
        props,
      }
    }
  })
export default function TokenTopup(props) {
  const [tokens, setTokens] = useState(0)
  console.log("Prop2==", props)
  const handleToken = async()=>{
    const response = await fetch("http://localhost:3000/api/addTokens", {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
    });
    const data = await response.json();
    console.log("DATA==", data)
    setTokens(data.post);
  }
    return <div>
      <button className="btn" onClick={handleToken}>Add Token</button>
    </div>
  }
  
  TokenTopup.getLayout = function getLayout(page, pageProps){
    return <AppLayout {...pageProps}>{page}</AppLayout>
  }
