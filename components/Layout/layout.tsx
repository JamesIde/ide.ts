import Link from "next/link";
import { HiExternalLink } from "react-icons/hi";
import { usePathname } from "next/navigation";

function Layout({ children }) {
  const pathname = usePathname();

  const pathSegments = pathname.split("/");

  const multiday = "/records/multiday";
  const photos = "/collections/photos";
  const blog = "blog";

  // TODO potential onClick needed to reset state

  return (
    <body className="min-h-screen bg-gray-100 mt-20">
      <div className="flex w-full">
        <div className="w-1/3 text-right">
          <Link href="/">
            <h1 className="playfair text-3xl mb-4 pr-4">James Ide</h1>
          </Link>
          <div className="text-left w-max ml-auto font-mono ">
            <ul className="list-none my-2">
              <li className="list-none">
                <Link
                  href={multiday}
                  replace
                  className={`text-base hover:text-sky-700 duration-500 text-black ${
                    pathSegments.includes("records") ? "text-sky-700" : "text-black"
                  }`}
                >
                  multi day hikes
                </Link>
              </li>
              <li className="list-none">
                <Link
                  href={photos}
                  replace
                  className={`text-base hover:text-sky-700 duration-500 text-black ${
                    pathSegments.includes("photos") ? "text-sky-700" : "text-black"
                  }`}
                >
                  photo collections
                </Link>
              </li>
              <li className="list-none">blog entries</li>
            </ul>
            <hr />
            <ul className="list-none my-2">
              <li className="list-none">
                <Link href="/about" className="text-base hover:text-sky-700 duration-500 text-black">
                  about
                </Link>
              </li>
              <li className="list-none">
                <Link href="/gear" className="text-base hover:text-sky-700 duration-500 text-black">
                  gear
                </Link>
              </li>
              <li className="list-none">
                <a
                  href="mailto:james.ide775@gmail.com"
                  target="_#"
                  className="text-base hover:text-sky-700 duration-500 text-black"
                >
                  contact
                  <HiExternalLink size="0.7rem" className="inline-block" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        {children}
      </div>
    </body>
  );
}
export default Layout;
