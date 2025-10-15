import { createClient, Entry, EntryCollection } from "contentful";
import { IEntries } from "../../../@types/generated/contentful";
import { CollectionSubset } from "../models/models";

export const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID as string,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
});

export async function getContentfulEntries<T>(
  contentType: "entries" | "thumbnail" | "photoCollection"
): Promise<EntryCollection<T>> {
  const entries = await client.getEntries({
    content_type: contentType,
  });
  return entries as unknown as any;
}

export async function getRecordBySlug(slug: string) {
  const record = await client.getEntries({
    content_type: "thumbnail",
    "fields.slug": slug,
  });
  return record.items;
}

export async function getPhotoCollectionBySlug(slug: string) {
  const collection = await client.getEntries({
    content_type: "photoCollection",
    "fields.slug": slug,
  });
  return collection.items;
}

export async function getBlogEntryBySlug(slug: string) {
  const entry = await client.getEntries({
    content_type: "entries",
    "fields.slug": slug,
  });
  return entry.items[0] as IEntries;
}

export async function downloadFromContentful(collection: CollectionSubset) {
  console.log(`Downloading from ${process.env.CDN_BASE_URL} for ${collection.assets.length} assets`);
  var map = new Map<string, ArrayBuffer>();

  await Promise.all(
    collection.assets.map(async (asset) => {
      const response = await fetch(`https:${asset.contentfulUrl}`);
      const buffer = await response.arrayBuffer();
      console.log(`Downloaded ${asset.contentfulUrl}`);
      map.set(asset.fileName, buffer);
    })
  );
  return map;
}
