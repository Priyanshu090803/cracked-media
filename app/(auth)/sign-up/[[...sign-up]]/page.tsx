import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
  <div className=' h-screen w-full flex items-center justify-center'>
        <SignUp
        appearance={{
          elements: {
            footer: 'hidden', // hides the "Don't have an account?" link
            cardFooter: 'hidden', // hides the "Secured by Clerk" + "Development mode"
          },
        }}
        />
      </div>
      )
}