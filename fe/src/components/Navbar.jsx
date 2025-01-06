import { useNavigate } from 'react-router';
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = () => {

  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();
  const navigate = useNavigate();

  return (
    <div className="bg-stone-900 flex text-white justify-around">
      <div className='content-center font-mono text-2xl font-bold text-green-500 py-3'>
        CodeClaw
      </div>
      <ul className="flex items-center gap-6">
        <li onClick={() => navigate('/')}>Problems</li>
      </ul>
      <ul className="flex items-center gap-6">
        {isAuthenticated ? <li onClick={() => logout()}>Logout</li> : <li onClick={() => loginWithRedirect()}>Login</li>}
        
        
      </ul>
    </div>
  )
}

export default Navbar