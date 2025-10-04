import SafeAreaView from "components/SafeAreaView/safeAreaView";
import Helmet from "../components/Navigation/Helmet";
import Layout from "../components/Navigation/Layout";

function about() {
  return (
    <Layout>
      <SafeAreaView>
        <Helmet title="about" />
        <div className="xl:w-5/12 lg:w-5/12 md:w-10/12 mx-auto xl:mt-32 p-2 ">
          <h1 className="font-bold text-xl mb-3">About</h1>
          <p className="text-gray-600">
            Software developer and hiker from Adelaide occasionally sharing photos and writing.
          </p>
          <h1 className="font-bold text-xl mb-3 mt-4">Contact</h1>
          <p className="text-gray-600">
            <a href="mailto:james.ide775@gmail.com" target="_#" className="text-black underline">
              Email
            </a>{" "}
            <a href="https://www.linkedin.com/in/james-ide-a92368180/" target="_#" className="text-black underline">
              LinkedIn
            </a>{" "}
            <a href="https://github.com/JamesIde" target="_#" className="text-black underline">
              Github
            </a>{" "}
            <a
              href="https://www.instagram.com/james.ide/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black underline"
              aria-label="Instagram"
            >
              Instagram
            </a>
          </p>
          <p className="text-gray-600 mt-5 text-sm">Built with NextJS, Markdown, Contentful and TailwindCSS.</p>
        </div>
      </SafeAreaView>
    </Layout>
  );
}
export default about;
