
const Navbar = () => {
  return (
    <div className="bg-slate-900 flex text-white justify-around">
      <img className="h-12 w-20" src="image.png" alt="CodeClaw" />
      <ul className="flex items-center gap-6">
        <li>Problems</li>
        <li>Contest</li>
      </ul>
      <ul className="flex items-center gap-6">
        <li>Signup</li> 
        <li>Login</li>
      </ul>
    </div>
  )
}

export default Navbar