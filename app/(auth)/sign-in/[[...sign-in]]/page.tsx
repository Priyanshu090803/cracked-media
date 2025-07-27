import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'

export default function Page() {
  return (
    <div className=' py-20  min-h-screen h-full flex-col gap-6 w-full flex items-center justify-center  bg-gradient-to-r from-neutral-900 via-black to-neutral-800'>
      <SignIn
      appearance={{
        elements:{
          logoBox:'hidden',
          logoImage:"hidden",
        }
      }}
      />
        <Link href={'/'} className=' text-neutral-50 bg-gradient-to-tr  hover:bg-gradient-to-tr from-blue-500 px-3 py-1 rounded-xl hover:from-blue-600 transition-colors'>Continue without Sign In</Link>

    </div>
  )
}