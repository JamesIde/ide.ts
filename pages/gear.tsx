import Helmet from "../components/Navigation/Helmet";
import Layout from "../components/Navigation/Layout";
import Link from "next/link";
import Script from "next/script";
export default function gear() {
  return (
    <Layout>
      <Helmet title="Gear" />
      <div className="mx-auto xl:w-[50%] md:w-[50%] w-full h-auto mt-5 mb-5">
        <div className="mx-auto ml-5 mr-5">
          <p className="text-sm mb-4 hover: cursor-pointer" onClick={() => window.location.reload()}>
            See nothing? Click here to refresh
          </p>
          <p className="text-sm mb-4">Last updated: 1/12/2024</p>
          {/* div with the id is required for script loading */}
          <Script src="https://lighterpack.com/e/9camuq" />
          <div id="9camuq"></div>
        </div>
        <div>
          <Link href="/" className="hover:text-sky-700 duration-500 font-mono text-center">
            <p className="text-center font-mono">[Return to home]</p>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
