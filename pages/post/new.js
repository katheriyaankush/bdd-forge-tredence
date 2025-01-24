import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import AppLayout from "../../Components/AppLayout/AppLayout";
import { useState } from "react";
import { useRouter } from "next/router";
import { getAppProps } from "../../utils/getAppProps";
import HashLoader from "react-spinners/HashLoader";

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    return {
      props,
    };
  },
});
const override = {
  color: "green",
};
export default function NewPage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  let [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch("http://localhost:3000/api/generatePost", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ topic, keywords }),
    });
    const data = await response.json();
    setLoading(false);
    if (data.postId) {
      router.push(`/post/${data.postId}`);
    }
  };
  return (
    <div>
      {loading ? (
        <div className="flex flex-row min-h-screen justify-center items-center">
          <HashLoader color="rgb(34 197 94)" />
        </div>
      ) : (
        <div className="flex flex-row min-h-screen justify-center items-center relative">
        <div className="relative z-10 text-black px-10 py-5 text-center max-w-screen-sm w-max bg-gray-200/100 rounded-md backdrop-blur-sm ">
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              <strong>Generate your blog post on the topic of:</strong>
              <textarea
                className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              ></textarea>
            </label>
          </div>
          <div>
            <label>
              <strong>Targeting the folowing keywords:</strong>
              <textarea
                className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              ></textarea>
            </label>
          </div>
          <button className="btn">Generate</button>
        </form>
        </div>
        </div>
      )}
    </div>
  );
}

NewPage.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};
