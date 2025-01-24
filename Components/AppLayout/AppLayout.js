import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import Logo from "../Logo/Logo";

export default function AppLayout({ children, availableTokens, postId, posts }) {
  console.log("PRR==", postId, availableTokens)
  const { user } = useUser();

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      <div className="flex flex-col text-white overflow-hidden">
        <div className="bg-slate-800 px-2">
          <Logo></Logo>
          <Link href="/post/new" className="bg-green-500 tracking-wider w-full text-center text-white font-bold cursor-pointer uppercase px-4 py-2 rounded-md hover:bg-green-600 transition-colors block">
          New Post
          </Link>
          <Link href="/token-topup" className="block mt-2 text-center">
          <FontAwesomeIcon icon={faCoins} className="px-2 text-yellow-500"></FontAwesomeIcon>
          {availableTokens} tokens available
          </Link>
        </div>
        <div className="px-4 flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800">
          {posts && posts.map((post, i)=>(
            <Link key={i} href={`/post/${post._id}`} className={`block text-ellipsis overflow-hidden my-1 px-2 bg-white/10 cursor-pointer rounded-sm ${post._id === postId ? "bg-white/30" : ""}`}>{ post.topic }  </Link>
          ))}
        </div>
        <div className="bg-cyan-800 flex items-center gap-2 border-t border-t-black/50 h-20 px-2">
          {user ? (
            <>
            <div className="min-w-[45px]">
              <Image
                src={user.picture}
                alt={user.name}
                width={45}
                height={45}
                className="rounded-full"
              ></Image>
              </div>
              <div className="flex-1">
              <div className="font-bold"> {user.email}</div>
              <Link className="text-sm" href="/api/auth/logout">Logout</Link>
              </div>
            </>
          ) : (
            <Link href="/api/auth/login">Login</Link>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
