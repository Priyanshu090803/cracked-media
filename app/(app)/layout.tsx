'use client';
import { useClerk, useUser } from "@clerk/nextjs";
// import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
// import Image from "next/image";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar"
 

 


export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 const navItems = [
    {
      name: "Home  ",
      link: "/home",
    },
    {
      name: "Social Share",
      link: "/social-share",
    },
    {
      name: "Video Upload",
      link: "/video-upload",
    },
  ];


  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  // const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <div className="flex flex-col w-full h-full  bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <Navbar className=" w-full">
        {/* Desktop Navigation */}
        <NavBody className=" w-full">
          <NavbarLogo />
          <NavItems items={navItems} className=" w-full "/>
          <div className="flex items-center gap-4  ">
            
             {user &&<div className=" flex items-center gap-2     border-neutral-700  px-2 py-1 rounded-2xl">
           <div className="flex items-center gap-1  -mx-4 rounded-lg bg-gradient-to-tl from-gray-200  to-indigo-100 px-2 py-1">
            {/* <Image src={user?.imageUrl || "/default-profile.png"} alt="profile-img" height={24} width={24} className=" rounded-full"/> */}
                <ContainerTextFlip
                className=""
           words={["Yo",'नमस्ते',"Hello","Hi"]}
          />  
            {/* <p className=" text-sm underline text-neutral-600">{user?.emailAddresses?.[0]?.emailAddress || ""}</p> */}
              <p className="  text-neutral-700 text-sm  underline  ">  {user?.fullName || "User"} </p>
          
            </div>
            </div>
           }
           {
            user?( <NavbarButton variant="secondary" className=" bg-gradient-to-tr mx-auto  from-fuchsia-100 to-indigo-300 px-2 py-[6px] flex items-center gap-1 font-medium"
            onClick={handleSignOut}
            >Logout  </NavbarButton>):
            ( <NavbarButton variant="secondary" className=" bg-gradient-to-tr mx-auto  from-fuchsia-100 to-indigo-300 px-2 py-[6px] flex items-center gap-1 font-medium"
            onClick={()=>router.push('/sign-in')}
            >Login</NavbarButton>)
          }
            {/* <NavbarButton variant="primary">Book a call</NavbarButton> */}
          </div>
        </NavBody>
 
        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo  />
            
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>
 
          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              {/* <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                {user?"Logout":"Login"}
              </NavbarButton> */}
              {
            user?( <NavbarButton variant="primary" className=" w-full"
            onClick={handleSignOut}
            >Logout  </NavbarButton>):
            ( <NavbarButton variant="primary" className=" w-full"
            onClick={()=>router.push('/sign-in')}
            >Login</NavbarButton>)
          }
               {user &&<div className=" flex items-end -mb-4 justify-center gap-4"> 
            {/* <p className=" text-sm underline text-neutral-600">{user?.emailAddresses?.[0]?.emailAddress || ""}</p> */}
                <p className=" text-sm underline text-neutral-600">{user.fullName || ""}</p>
            </div>
           }
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      <main className="flex-grow p-6 h-full w-full  ">

        {children}
      </main>
    </div>
  );
}