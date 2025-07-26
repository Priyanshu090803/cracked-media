'use client';
import { useClerk, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import {LogOutIcon,LayoutDashboardIcon,Share2Icon,UploadIcon,ImageIcon,MenuIcon} from "lucide-react";
import Image from "next/image";

const sideBarItems = [
  { href:"/home", icon: LayoutDashboardIcon, label: "Home Page" },
  {href:"/social-share", icon: Share2Icon, label: "Social Share" },
  {href:"/video-upload", icon: UploadIcon, label: "Video Upload" },
]


export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };
          {console.log( user)}

  return (
    <div className="flex h-full overflow-y-hidden">
      <aside className={` bg-gradient-to-br from-purple-100 via-indigo-50 to-fuchsia-100    text-white w-64 top-0 sticky ${isOpen ? "block" : "hidden"} md:block`}>
        <div className="p-4 w-full   ">
          <h2 className=" text-3xl text-transparent bg-clip-text bg-gradient-to-t from-neutral-500 to-violet-400 font-semibold mb-10 text-center">Dashboard</h2>
          <ul>
            {sideBarItems.map((item) => (
              <li key={item.href} className={`mb-2 ${pathname === item.href ? "bg-gray-300  rounded-lg" : ""}`}>
                <Link href={item.href} className="flex text-black items-center p-2 hover:bg-gray-200  rounded-lg px-2 py-3">
                  <item.icon className="mr-2 " />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 p-4   border-gray-700">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center px-4  hover:bg-red-500 hover:text-white text-black py-3 cursor-pointer transition-colors rounded"
          >
            <LogOutIcon className="mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-grow p-6  ">
        <header className="flex items-center justify-between mb-6">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 bg-gray-800 text-white rounded"
          >
            <MenuIcon />
          </button>
          <p className="text-lg text-neutral-700 underline  ">Welcome, {user?.fullName || "User"}!</p>
          <div className=" flex items-center h-full gap-4 border border-neutral-300 rounded-lg px-3 py-1">
            <p className=" text-sm text-neutral-600">{user?.emailAddresses?.[0]?.emailAddress || ""}</p>
                      <Image src={user?.imageUrl || "/default-profile.png"} alt="profile-img" height={32} width={32} className=" rounded-full"/>

          </div>

          
        </header>

        {children}
      </main>
    </div>
  );
}