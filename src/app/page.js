"use client";

import Image from "next/image";
import Auth from "./components/Auth";
import Cookies from "universal-cookie";
import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "./firebse-config";

export default function Home() {
  const cookies = new Cookies();
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [chatRoom, setChatRoom] = useState(null);
  const inputRef = useRef(null);
  const router = useRouter();
  const searchParams = useParams();

  const handleRedirect = (e) => {
    e.preventDefault();
    inputRef?.current.value.trim() !== "" &&
      router.push(`/chat/${inputRef?.current?.value.trim()}`);
  };

  const handleSignout = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    setIsAuth(false);
    setChatRoom(null);
  };

  useEffect(() => {
    handleSignout();
  }, []);

  if (!isAuth) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Auth setIsAuth={setIsAuth} />
      </main>
    );
  }

  return (
    <div>
      {
        <div className="bg-gradient-to-r from-indigo-500 w-2/3 flex justify-center flex-1 flex-col m-auto text-center p-4 mt-10 gap-10">
          <div className="animate-bounce ">
            <h1>Enter Chat Room Name</h1>
          </div>
          <div>
            <form action="" onSubmit={(e) => handleRedirect(e)}>
              <input
                ref={inputRef}
                className="w-full h-20 text-center text-blue-700  bottom-0 font-bold"
                placeholder={`type "room1" for entring existing room `}
              />
            </form>
          </div>
          <div className="hover:scale-150 duration-300">
            <button onClick={(e) => handleRedirect(e)}>Enter Chat</button>
          </div>
        </div>
      }
      <div className="absolute top-0 right-20 bg-gradient-to-r from-teal-400 to-yellow-200 text-blue-950 text-sm font-bold p-4  ">
        <button onClick={() => handleSignout()}>sign out</button>
      </div>
    </div>
  );
}
