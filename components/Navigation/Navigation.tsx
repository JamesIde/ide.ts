import Link from "next/link";
import { HiExternalLink } from "react-icons/hi";
function Navigation({ color }: { color: string }) {
  return (
    <div
      className="navbar  mb-2"
      style={{
        color: color,
      }}
    >
      <div className="container mx-auto ">
        <div className="flex-1">
          <div className="flex-none text-center nav-center mb-2">
            <Link href="/">
              <h1 className="playfair text-4xl">James Ide</h1>
            </Link>
          </div>
          <div className="lg:w-[900px] md:w-[600px] mx-auto">
            <hr />
          </div>

          <div className="flex justify-center mt-1 font-mono">
            <Link
              href="/about"
              className="text-base hover:text-sky-700 duration-500 lg:mr-3 md:mr-3 sm:mr-3 mr-3"
            >
              ABOUT
            </Link>
            <Link
              href="/gear"
              className="text-base hover:text-sky-700 duration-500 lg:mr-3 md:mr-3 sm:mr-3 mr-3"
            >
              GEAR
            </Link>
            <a
              href="mailto:james.ide775@gmail.com"
              target="_#"
              className="text-base hover:text-sky-700 duration-500 lg:mr-3 md:mr-3 sm:mr-3 mr-3 p-0"
            >
              CONTACT
              <HiExternalLink size="0.7rem" className="inline-block" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Navigation;
