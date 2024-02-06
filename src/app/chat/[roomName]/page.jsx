"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { auth, db } from "@/app/firebse-config";
import Cookies from "universal-cookie";
import { signOut } from "firebase/auth";
import Image from "next/image";

const RoomName = ({ params }) => {
  const isBrowser = () => typeof window !== "undefined";
  const [loading, setLoading] = useState(true);
  const cookies = new Cookies();
  const router = useRouter();
  const [text, setText] = useState("");
  const [inbox, setInbox] = useState([]);
  const containerRef = useRef();
  const chatRefDb = collection(db, "chats");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (text === "") return;
      await addDoc(chatRefDb, {
        text: text,
        createdAt: serverTimestamp(),
        user: auth?.currentUser?.displayName,
        url: auth?.currentUser?.photoURL,
        roomName: params?.roomName,
      });
      setText("");
    } catch (error) {
      console.log(error);
    }
  };
  const handleClickScroll = () => {
    const element = document.getElementById("section-1");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleSignout = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    router.push(`/`);
  };
  useEffect(() => {
    const queryInbox = query(
      chatRefDb,
      where("roomName", "==", params.roomName),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(queryInbox, (snapshot) => {
      handleClickScroll();

      let messages = [];
      snapshot.empty !== null && setLoading(false);
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
        // console.log(doc);
      });

      setInbox(messages);
    });
    return () => unsubscribe();
  }, []);
  if (loading) {
    return <div class="loader"></div>;
  }

  return (
    <div className="pt-4">
      <div className="">
        <div className="absolute top-2 right-20 bg-gradient-to-r from-teal-400 to-yellow-200 text-blue-950 text-sm font-bold p-2 mb-4  ">
          <button onClick={() => handleSignout()}>sign out</button>
        </div>
        <h1 className=" "> {params.roomName}</h1>
        {inbox.length <= 0 && <h1>Start Conversation</h1>}
        {inbox.length >= 5 && (
          <button className="btn-scroll" onClick={handleClickScroll}>
            Scroll Down
          </button>
        )}
        <div
          className="h-[80vh] overflow-hidden 
        bg-gradient-to-r from-fuchsia-700 to-indigo-600 
        pt-4
        "
        >
          <div ref={containerRef} className="h-[80vh] overflow-auto">
            {inbox.map((item, index) => (
              <>
                {item.user === auth?.currentUser?.displayName ? (
                  <div
                    key={index}
                    className="bg-slate-600 mb-10 max-w-max p-4 ml-auto mr-4"
                  >
                    <div className="flex justify-between gap-4">
                      <img
                        src={item?.url}
                        alt="op"
                        className="w-10 h-10 rounded-[50%] "
                      />
                      <div>
                        <h1>{item.user}</h1>
                        <h1>{item.text}</h1>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    key={index}
                    className="bg-cyan-800 mb-10 max-w-max p-4  ml-[2vw]"
                  >
                    <div className="flex justify-between gap-4">
                      <img
                        src={item?.url}
                        alt="op"
                        className="w-10 h-10 rounded-[50%] "
                      />
                      <div>
                        <h1>{item.user}</h1>
                        <h1>{item.text}</h1>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ))}
            <div id="section-1" className="bottom-0 opacity-0">
              Section 1
            </div>
          </div>
        </div>
        <form action="" onSubmit={(e) => handleSubmit(e)} className=" ">
          <input
            onChange={(e) => setText(e.target.value)}
            className="w-screen h-20 text-center text-blue-700 absolute  bottom-0 font-bold"
            value={text}
            placeholder="type here"
          />
        </form>
      </div>
    </div>
  );
};

export default RoomName;
