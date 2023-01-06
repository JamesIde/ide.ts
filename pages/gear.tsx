import Helmet from "../components/navigation-seo/helmet";
import Layout from "../components/navigation-seo/layout";
import Link from "next/link";
import Script from "next/script";
export default function gear() {
  return (
    <Layout>
      <Helmet title="Gear" />
      <div className="mx-auto lg:w-2/3 h-auto mt-5 mb-5">
        <div className="mx-auto ml-5 mr-5">
          <Script src="https://lighterpack.com/e/0bu8zl" />
          <div id="0bu8zl"></div>
        </div>
        <div>
          <Link
            href="/"
            className="hover:text-sky-700 duration-500 font-mono text-center"
          >
            <p className="text-center font-mono">[Return to home]</p>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
