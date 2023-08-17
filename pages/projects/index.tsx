import Image from "next/image";
import { IProjects } from "../../@types/generated/contentful";
import Helmet from "../../components/Navigation/Helmet";
import Layout from "../../components/Navigation/Layout";
import { getContentfulEntries } from "../../lib/api/contentful";
import ProjectItem from "../../components/Projects/projectItem";

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
        <h1 className="text-2xl font-playfair mb-5">Projects</h1>
        {projects.map((project: IProjects) => {
          return <ProjectItem project={project} key={project.fields.slug} />;
        })}
      </div>
    </Layout>
  );
}
