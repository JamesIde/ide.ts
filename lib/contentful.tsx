import contentful from "contentful";
import { createClient } from "contentful";
import { IThumbnail } from "../@types/generated/contentful";
// Create client and export it for use

export const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID as string,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
});

export const getContentfulEntries = async (contentType: string) => {
  const entries = await client.getEntries({
    content_type: contentType,
  });
  return entries;
};

export const getRecordSlugs = async () => {
  const entries = await client.getEntries({
    content_type: "thumbnail",
  });
  return entries.items.map((entry: any) => {
    return {
      params: {
        slug: entry.fields.slug,
      },
    };
  });
};

export const getRecordBySlug = async (slug: string) => {
  const record = await client.getEntries({
    content_type: "thumbnail",
    "fields.slug": slug,
  });
  return record.items[0] as IThumbnail;
};
