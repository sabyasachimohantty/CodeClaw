import logo from '../assets/image.png'
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = () => {

  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();

  return (
    <div className="bg-stone-900 flex text-white justify-around">
      <img className="h-12 w-20" src={logo} alt="CodeClaw" />
      <ul className="flex items-center gap-6">
        <li>Problems</li>
        <li>Contest</li>
      </ul>
      <ul className="flex items-center gap-6">
        {isAuthenticated ? <li onClick={() => logout()}>Logout</li> : <li onClick={() => loginWithRedirect()}>Login</li>}
        
        
      </ul>
    </div>
  )
}

export default Navbar