import Helmet from "../components/Navigation/Helmet";

function about() {
  return (
    <>
      <Helmet title="about" />
      <div className="p-4">
        <h1 className="font-bold text-xl my-2 font-mono ">About</h1>
        <p className="text-gray-600">
          Software developer and hiker. Sharing trips, projects, photos and anything I&apos;m interested in.
        </p>

        <p className="text-gray-600 mt-10 text-sm">
          This website is built with NextJS, Markdown, Contentful and TailwindCSS.
        </p>
      </div>
    </>
  );
}
export default about;
