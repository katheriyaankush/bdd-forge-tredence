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
  let [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch("http://localhost:3000/api/generatePost", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ topic }),
    });
    const data = await response.json();
    if (data.postId) {
      router.push(`/post/${data.postId}`);
    }
    setLoading(false);
  };
  return (
    <div>
      {loading ? (
        <div className="flex flex-row min-h-screen justify-center items-center">
          <HashLoader color="rgb(34 197 94)" />
        </div>
      ) : (
        <div className="h-full overflow-hidden">
        <div className="w-full h-full flex flex-col overflow-auto">
        <form onSubmit={handleSubmit} className="m-auto w-full max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl border border-slate-200 shadow-slate-200 ">
          <div>
            <label className="text-gray-500">
              <strong>Generate your new BDD test case:</strong>
              <textarea
                className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
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
