import { AssetSubset, CollectionSubset } from "../models/models";
import * as dotenv from "dotenv";

dotenv.config();

export async function checkExistsCDN(collection: CollectionSubset): Promise<Response[]> {
  console.log(`Querying ${process.env.CDN_BASE_URL} for ${collection.assets.length} assets that may already exist`);
  return await Promise.all(
    collection.assets.map((a) => getImageFetch(`${collection.baseType}/${collection.slug}/${a.fileName}`))
  );
}

export async function uploadImageCDN(r2Directory: string, images: Map<string, ArrayBuffer>) {
  await Promise.all(
    Array.from(images.entries()).map(async ([key, value]) => {
      const response = await uploadFetch(`${r2Directory}/${key}`, value);
      if (response.ok) console.log(`${key} uploaded`);
    })
  );
}

async function uploadFetch(fileName: string, arrayBuffer: ArrayBuffer) {
  const headers = new Headers();

  headers.set("Authorization", `Basic ${process.env.BASIC_AUTH_HASH}`);
  headers.set("Content-Type", "application/octet-stream");
  headers.set("x-cf-file-path", fileName);

  var url = `https://${process.env.CDN_BASE_URL}`;

  try {
    return await fetch(url, {
      headers,
      method: "POST",
      body: arrayBuffer,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    console.warn(message);
  }
}

async function getImageFetch(image: string) {
  const headers = new Headers();

  headers.set("Content-Type", "application/json");
  headers.set("Authorization", `Basic ${process.env.BASIC_AUTH_HASH}`);

  var url = `https://${process.env.CDN_BASE_URL}/${image}?validate=true`;
  console.log(`Requesting ${url}`);

  try {
    return await fetch(url, {
      headers,
      method: "GET",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    console.warn(message);
  }
}
