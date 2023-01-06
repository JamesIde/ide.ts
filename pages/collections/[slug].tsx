import { IPhotoCollection } from "../../@types/generated/contentful";
import {
  getPhotoCollectionBySlug,
  getPhotoCollectionSlugs,
} from "../../lib/contentful";

export default function Collection({
  collection,
}: {
  collection: IPhotoCollection;
}) {
  console.log(JSON.stringify(collection));
  return <div>Collections</div>;
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const collection = await getPhotoCollectionBySlug(params.slug);
  return {
    props: {
      collection,
    },
  };
}

export async function getStaticPaths() {
  const slugs = await getPhotoCollectionSlugs();
  return {
    paths: slugs,
    fallback: false,
  };
}
