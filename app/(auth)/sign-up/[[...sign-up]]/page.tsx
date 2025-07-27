import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'

export default function Page() {

  return (
  <div className=' py-20  min-h-screen h-full w-full gap-4 flex items-center flex-col justify-center  bg-gradient-to-r from-neutral-900 via-black to-neutral-800'>
{        <SignUp
        appearance={{
          elements:{
            logoBox:'hidden',
            logoImage:"hidden",
          }
        }}
        />
        
        }
   <Link href={'/'} className=' text-neutral-50 bg-gradient-to-tr  hover:bg-gradient-to-tr from-blue-500 px-3 py-1 rounded-xl hover:from-blue-600 transition-colors'>Continue without Sign Up</Link>
      </div>
      )
}