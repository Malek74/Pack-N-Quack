import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="container flex py-8">
      <Link className="text-xl">Pack n' Quack</Link>
      <nav className="container">
        <h1>Rooma bel double o</h1>
        <h1>Rooma bel double o</h1>
        <ul className="flex justify-end gap-2">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/admin">Admin</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
