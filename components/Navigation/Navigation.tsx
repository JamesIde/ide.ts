import Link from "next/link";
import { MdOutlineMail } from "react-icons/md";
import { FaInstagram } from "react-icons/fa";

function Navigation({ color }: { color: string }) {
  return (
    <div
      className="navbar mb-2"
      style={{
        color: color,
      }}
    >
      <div className="container mx-auto">
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
            <Link href="/about" className="text-base hover:text-sky-700 duration-500 lg:mr-3 md:mr-3 sm:mr-3 mr-3">
              ABOUT
            </Link>
            <Link href="/gear" className="text-base hover:text-sky-700 duration-500 lg:mr-3 md:mr-3 sm:mr-3 mr-3">
              GEAR
            </Link>
            {/* <div className="pr-3">
              <p>|</p>
            </div>
            <div>
              <a
                href="mailto:james.ide775@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base hover:text-sky-700 duration-500 lg:mr-3 md:mr-3 sm:mr-3 mr-3 p-0"
                aria-label="Email"
              >
                <MdOutlineMail className="inline-block text-lg hover:text-sky-700 duration-500" size={20} />
              </a>
            </div>
            <div>
              <a
                href="https://www.instagram.com/james.ide/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base hover:text-sky-700 duration-500 p-0"
                aria-label="Instagram"
              >
                <FaInstagram className="inline-block text-lg hover:text-sky-700 duration-500" />
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navigation;
