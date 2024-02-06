"use client";

import { signInWithPopup } from "firebase/auth";
import React, { useRef, useState } from "react";
import { auth, provider } from "../firebse-config";

import Cookies from "universal-cookie";

const Auth = ({ setIsAuth }) => {
  const cookies = new Cookies();
  const signInwithGoogle = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      cookies.set("auth-token", response.user.refreshToken);
      cookies.set("imgUrl", response.user.photoURL);
      cookies.set("access-token", response.user.accessToken);
      setIsAuth(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    // <div  >
    <div className="bg-gradient-to-r from-indigo-500 w-2/3 flex justify-center flex-1 flex-col m-auto text-center p-4 mt-10 gap-10">
      <h1 className="font-bold text-lg ">Chit Chatter</h1>

      <h1>sign in with google</h1>
      <button
        className="bg-gradient-to-r from-emerald-500 to-emerald-900 w-auto p-4 rounded "
        onClick={() => signInwithGoogle()}
      >
        Google
      </button>
    </div>
  );
};

export default Auth;
