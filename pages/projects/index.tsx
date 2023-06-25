import Image from "next/image";
import { IProjects } from "../../@types/generated/contentful";
import Helmet from "../../components/Navigation/Helmet";
import Layout from "../../components/Navigation/Layout";
import { getContentfulEntries } from "../../lib/api/contentful";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

export async function getStaticProps() {
  const cProjects = await getContentfulEntries("projects");
  let sorted = cProjects.items.sort((a: IProjects, b: IProjects) => {
    console.log(a.fields.title, b.fields.title);
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
        <section>
          {projects.map((project: IProjects) => {
            return (
              <>
                <div
                  className="flex md:flex-col lg:flex-row xl:flex-row flex-col
                gap-2 md:gap-4 lg:gap-4 xl:gap-4  hover:border-gray-200"
                >
                  <Image
                    src={`https:${project.fields.logo.fields.file.url}`}
                    alt={project.fields.logo.fields.title}
                    width={128}
                    height={128}
                    quality={100}
                    className="mx-auto mb-2 md:mb-0 lg:mb-0 xl:mb-0 md:mx-auto lg:mx-0 xl:mx-0 "
                  />
                  <div>
                    <h3 className="text-3xl font-nova font-bold text-center md:text-center xl:text-left lg:text-left">
                      {project.fields.title.toUpperCase()}
                    </h3>
                    <span className="font-nova text-md md:text-center xl:text-left lg:text-left">
                      <ReactMarkdown>
                        {project.fields.description}
                      </ReactMarkdown>
                    </span>
                  </div>
                </div>
                {projects.indexOf(project) !== projects.length - 1 && (
                  <hr className="mt-4 mb-4" />
                )}
              </>
            );
          })}
        </section>
      </div>
    </Layout>
  );
}
