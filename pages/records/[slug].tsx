import { useRouter } from "next/router";
import {
  IThumbnail,
  IThumbnailFields,
} from "../../@types/generated/contentful";
import Helmet from "../../components/navigation-seo/helmet";
import Layout from "../../components/navigation-seo/layout";
import { getRecordBySlug, getRecordSlugs } from "../../lib/contentful";
export default function Record({ record }: { record: IThumbnail }) {
  return (
    <>
      <Layout>
        <Helmet title={record.fields.title!} />
        <div>{record.fields.title}</div>
        <div className="prose">{record.fields?.dayOneDescription}</div>
      </Layout>
    </>
  );
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const record: IThumbnail = await getRecordBySlug(params.slug);
  console.log(JSON.stringify(record.fields.travelDescription));
  return {
    props: {
      record,
    },
  };
}

export async function getStaticPaths() {
  const slugs = await getRecordSlugs();
  return {
    paths: slugs,
    fallback: false,
  };
}
