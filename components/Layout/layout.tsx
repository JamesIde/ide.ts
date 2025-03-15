import Link from "next/link";
import { HiExternalLink } from "react-icons/hi";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";
function Layout({ children }) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();

  const navigate = (route: "/records/multiday" | "/collections/photos" | "/entries/all" | "/about" | "/gear" | "/") => {
    setMenuOpen(false);
    router.push(route);
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-4 md:pt-20">
      {/* Mobile Menu Button - Only visible on small screens */}
      <div className="md:hidden px-4 mb-4">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-black p-2 rounded-md">
          {menuOpen ? "✕ Close Menu" : "☰ Menu"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row w-full">
        {/* Sidebar - Full width on mobile (when open), 1/3 on larger screens */}
        <div
          className={`${menuOpen ? "block" : "hidden"} md:block w-full md:w-1/5 text-center md:text-right pb-4 md:pb-0`}
        >
          <a onClick={() => navigate("/")}>
            <h1 className="playfair text-2xl hover:cursor-pointer md:text-3xl mb-4 pl-5 md:pr-4 text-center">
              James Ide
            </h1>
          </a>
          <div className="text-center md:text-left md:w-max md:ml-auto font-mono px-4 md:px-0">
            <ul className="list-none my-2">
              <li className="list-none mb-2 md:mb-0">
                <a
                  // href={multiday}
                  onClick={() => navigate("/records/multiday")}
                  className={`text-base hover:text-sky-700 hover:cursor-pointer duration-500 ${
                    pathSegments.includes("records") ? "text-sky-700" : "text-black"
                  }`}
                >
                  multi day hikes
                </a>
              </li>
              <li className="list-none mb-2 md:mb-0">
                <a
                  onClick={() => navigate("/collections/photos")}
                  className={`text-base hover:text-sky-700 hover:cursor-pointer duration-500 ${
                    pathSegments.includes("collections") ? "text-sky-700" : "text-black"
                  }`}
                >
                  photo collections
                </a>
              </li>
              <li className="list-none mb-2 md:mb-0">
                <a
                  onClick={() => navigate("/entries/all")}
                  className={`text-base hover:text-sky-700 hover:cursor-pointer duration-500 ${
                    pathSegments.includes("entries") ? "text-sky-700" : "text-black"
                  }`}
                >
                  blog entries
                </a>
              </li>
            </ul>
            <hr className="my-3" />
            <ul className="list-none my-2">
              <li className="list-none mb-2 md:mb-0">
                <a
                  onClick={() => navigate("/about")}
                  className={`text-base hover:text-sky-700 hover:cursor-pointer duration-500 ${
                    pathSegments.includes("about") ? "text-sky-700" : "text-black"
                  }`}
                >
                  about
                </a>
              </li>
              <li className="list-none mb-2 md:mb-0">
                <a
                  onClick={() => navigate("/gear")}
                  className={`text-base hover:text-sky-700 hover:cursor-pointer duration-500 ${
                    pathSegments.includes("gear") ? "text-sky-700" : "text-black"
                  }`}
                >
                  gear
                </a>
              </li>
              <li className="list-none mb-2 md:mb-0">
                <a
                  href="mailto:james.ide775@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base hover:text-sky-700 duration-500 text-black"
                >
                  contact
                  <HiExternalLink size="0.7rem" className="inline-block ml-1" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Main content - Full width on mobile, 2/3 on larger screens */}
        <div className={`${menuOpen ? "hidden" : "block"} md:block w-full md:w-3/5`}>{children}</div>
      </div>
    </div>
  );
}

export default Layout;
