'use client';

import { signOut } from "next-auth/react";

export default function Home() {
  return (
    <div className="flex gap-4 items-center flex-col sm:flex-row">
      <button
        onClick={() => signOut({ callbackUrl: "/auth/login" })}
        className="rounded-full border border-solid  flex items-center justify-center bg-primary text-white gap-2 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto hover:bg-primarylight"
      >
        Logout
      </button>
    </div>
  );
}