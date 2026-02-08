import { SignIn, SignInButton, UserButton, SignedIn, SignedOut, SignUpButton, SignOutButton } from "@clerk/clerk-react";
import './App.css';


function App() {
  

  return (
    <>
      <h1>Hello World</h1>
      
      <SignedOut>
        <SignInButton />
        <SignUpButton />
      </SignedOut>
      {/* Show the user button and sign out when the user is signed in */}
      <SignedIn>
        <UserButton />
        <SignOutButton />
      </SignedIn>
    </>
  )
}

export default App
