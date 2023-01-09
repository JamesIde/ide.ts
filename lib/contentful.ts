import { createClient } from "contentful";
import {
  IEntries,
  IPhotoCollection,
  IThumbnail,
} from "../@types/generated/contentful";
import prisma from "./prisma";
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

/**
 * This seeds the database with new records if they are published on Contentful.
 *  The Vercel buildhook is triggered when pushing new records, so this function is called at build time
 * @param records
 */
export const seedContentfulRecords = async (records: IThumbnail[]) => {
  records.forEach(async (record) => {
    const existingRecord = await prisma.record.findUnique({
      where: {
        id: record.sys.id,
      },
    });

    if (!existingRecord) {
      const seededRecord = await prisma.record.create({
        data: {
          id: record.sys.id,
          title: record.fields.title,
          slug: record.fields.slug,
        },
      });
      console.log("seeded -->", seededRecord.id);
    } else {
      console.log(`found --> ${existingRecord.id}`);
    }
  }); // Probably remove the try catch. Have a validator call to check if we've got records. if not, process.exit (1)
};

/**
 * Each content type has a function to generate all slugs (used for dynamic routing)
 * And a function to get a single piece by slug
 */

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

export const getBlogEntrySlugs = async () => {
  const entries = await client.getEntries({
    content_type: "entries",
  });
  return entries.items.map((entry: any) => {
    return {
      params: {
        slug: entry.fields.slug,
      },
    };
  });
};

export const getBlogEntryBySlug = async (slug: string) => {
  const entry = await client.getEntries({
    content_type: "entries",
    "fields.slug": slug,
  });
  return entry.items[0] as IEntries;
};
