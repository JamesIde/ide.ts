import Image from "next/image";
import { IProjects } from "../../@types/generated/contentful";
import Helmet from "../../components/Navigation/Helmet";
import Layout from "../../components/Navigation/Layout";
import { getContentfulEntries } from "../../lib/api/contentful";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import ProjectItem from "./projectItem";

export async function getStaticProps() {
  const cProjects = await getContentfulEntries("projects");
  let sorted = cProjects.items.sort((a: IProjects, b: IProjects) => {
    return b.sys.createdAt.localeCompare(a.sys.createdAt);
  });
  return {
    props: {
      projects: sorted,
    },
  };
}

export default function Projects({ projects }: { projects: IProjects[] }) {
  return (
    <Layout>
      <Helmet title="Projects" />
      <div className="w-full md:w-full lg:w-4/5 xl:w-3/5 2xl:w-[50%] mx-auto p-2">
        <h1 className="text-2xl font-playfair">Projects</h1>
        <p className="mt-2 mb-4 font-nova">
          I am often building things in my spare time - sometimes these things
          make it to production.
        </p>
        {projects.map((project: IProjects) => {
          return <ProjectItem project={project} key={project.fields.slug} />;
        })}
      </div>
    </Layout>
  );
}
