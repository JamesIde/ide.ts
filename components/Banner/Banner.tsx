import Image from "next/image";
import Link from "next/link";
import { IBanner } from "../../@types/generated/contentful";
import Navigation from "../Navigation/Navigation";

function Banner({ banner }: { banner: IBanner }) {
  return (
    <div className="h-[100vh]">
      <Navigation color="white" />
      <Image
        src={`https:${banner.fields?.Banner?.fields?.file?.url}`}
        alt={banner.fields?.Banner?.fields?.title}
        quality={100}
        fill
        sizes="100vh"
        style={{
          objectFit: "cover",
          zIndex: -1,
        }}
        unoptimized={true}
      />
      <div
        className="flex justify-center items-center"
        style={{ height: `83vh` }}
      >
        <div className="text-center">
          <h1 className="xl:text-6xl md:t-3xl text-5xl text-white font-playfair pl-4 pr-4">
            {banner?.fields.title}
          </h1>
          {/* TODO STYLING */}
          <p className="text-white text-lg mt-2 mb-5 font-medium pl-3 pr-3">
            {banner?.fields.bannerDescription}
          </p>
          <Link
            href={`records/${banner?.fields.slug}`}
            className="text-md w-max border-2 mx-auto font-medium
                  p-2 bg-white text-black rounded hover:cursor-pointer duration-500 mt-4
                  hover:bg-neutral-300 "
          >
            READ MORE
          </Link>
        </div>
      </div>
    </div>
  );
}
export default Banner;
