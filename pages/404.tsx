import Link from "next/link";
import Helmet from "../components/Navigation/Helmet";
import Layout from "../components/Navigation/Layout";

export default function Custom404() {
  <Layout>
    <Helmet title="404" />
    <div className="container w-4/5 mx-auto text-center">
      <h1 className="font-playfair text-3xl mt-5 mb-5">Page Not Found</h1>
      <p className="mt-2 mb-2 font-mono">
        You have stumbled into the domain of the non-existant.
      </p>
      <p>
        <Link
          href="/"
          className="hover:text-sky-500 hover:cursor-pointer duration-500 font-mono"
        >
          Click here to return home
        </Link>
      </p>
    </div>
  </Layout>;
}
