import { createClient } from "contentful";
import { IPhotoCollection, IThumbnail } from "../@types/generated/contentful";

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

export const getPhotoCollectionSlugs = async () => {
  const entries = await client.getEntries({
    content_type: "photoCollection",
  });
  return entries.items.map((entry: any) => {
    return {
      params: {
        slug: entry.fields.slug,
      },
    };
  });
};

export const getPhotoCollectionBySlug = async (slug: string) => {
  const collection = await client.getEntries({
    content_type: "photoCollection",
    "fields.slug": slug,
  });
  return collection.items[0] as IPhotoCollection;
};
