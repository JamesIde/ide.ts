import { IProjects } from "../../@types/generated/contentful";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import Image from "next/image";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
function ProjectItem({ project }: { project: IProjects }) {
  return (
    <div className="hover:cursor-pointer">
      <div className="flex lg:flex-row xl:flex-row flex-col">
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
              <ReactMarkdown>{project.fields.description}</ReactMarkdown>
            </span>
          </div>
        </div>
        <div className="flex justify-center ">
          <p className="font-bold font-nova mt-[2px] lg:hidden hover:text-blue-500 duration-500">
            READ MORE
          </p>
          <MdOutlineKeyboardArrowRight size={25} color="black" />
        </div>
      </div>
      <hr className="mt-4 mb-4" />
    </div>
  );
}
export default ProjectItem;
