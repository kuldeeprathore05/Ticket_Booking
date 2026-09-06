import { Link, NavLink, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { Ticket, Menu, X, Search } from "lucide-react";

const navLink = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-white" : "text-white/50 hover:text-white/80"
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { user } = useUser(); 

  const onSearch = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/movies?search=${encodeURIComponent(q.trim())}`);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-900/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-500">
            <Ticket size={18} className="text-white" />
          </span>
          CineBook
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/movies" className={navLink}>Movies</NavLink>
          <NavLink to="/bookings" className={navLink}>My bookings</NavLink>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <form onSubmit={onSearch} className="relative">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search movies"
              className="w-52 rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm placeholder:text-white/30 focus:border-brand-500 focus:outline-none"
            />
          </form>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-900 transition hover:bg-white/90">
                Sign in
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/5 bg-ink-900 px-4 pb-5 pt-3 md:hidden">
          <form onSubmit={onSearch} className="relative mb-4">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search movies"
              className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm placeholder:text-white/30 focus:border-brand-500 focus:outline-none"
            />
          </form>
          <div className="flex flex-col gap-3">
            <NavLink to="/movies" className={navLink} onClick={() => setOpen(false)}>Movies</NavLink>
            <NavLink to="/bookings" className={navLink} onClick={() => setOpen(false)}>My bookings</NavLink>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="mt-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-900">
                  Sign in
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      )}
    </header>
  );
}
