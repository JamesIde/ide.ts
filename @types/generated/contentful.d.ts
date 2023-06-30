// THIS FILE IS AUTOMATICALLY GENERATED. DO NOT MODIFY IT.

import { Asset, Entry } from "contentful";
import { Document } from "@contentful/rich-text-types";

export interface IProjectFields {
  title?: string | undefined;

  slug?: string | undefined;

  description?: string | undefined;

  logo?: Asset | undefined;
}

/** Banner for the website. Title, slug, text and image */

export interface IProjects extends Entry<IProjectFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: "projects";
        linkType: "ContentType";
        type: "Link";
      };
    };
  };
}

export interface IBannerFields {
  /** BannerTitle */
  title?: string | undefined;

  /** BannerDescription */
  bannerDescription?: string | undefined;

  /** BannerImage */
  Banner?: Asset | undefined;

  /** slug */
  slug?: string | undefined;
}

/** Banner for the website. Title, slug, text and image */

export interface IBanner extends Entry<IBannerFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: "banner";
        linkType: "ContentType";
        type: "Link";
      };
    };
  };
}

export interface IEntriesFields {
  /** Title */
  title?: string | undefined;

  /** blurb */
  blurb?: string | undefined;

  /** slug */
  slug: string;

  /** date */
  date: string;

  /** FeaturedImage */
  featuredImage?: Asset | undefined;

  /** Main */
  main?: Document | undefined;
}

/** Rich text writings known as 'entries' */

export interface IEntries extends Entry<IEntriesFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: "entries";
        linkType: "ContentType";
        type: "Link";
      };
    };
  };
}

export interface IPhotoCollectionFields {
  /** title */
  title?: string | undefined;

  /** slug */
  slug?: string | undefined;

  /** featuredImage */
  featuredImage?: Asset | undefined;

  /** date */
  date?: string | undefined;

  /** photos */
  photos?: Asset[] | undefined;

  /** main */
  main?: Document | undefined;
}

/** Photo collections for my website in their own pages */

export interface IPhotoCollection extends Entry<IPhotoCollectionFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: "photoCollection";
        linkType: "ContentType";
        type: "Link";
      };
    };
  };
}

export interface IRouteFields {
  /** Trail Name */
  trailName: string;

  /** Slug */
  slug: string;

  /** published */
  published?: string | undefined;

  /** HeroImage */
  heroImage: Asset;

  /** Summary */
  summary?: string | undefined;

  /** DescriptionMain */
  descriptionMain?: Document | undefined;

  /** Trail Location */
  trailLocation?: string | undefined;

  /** Trail Country */
  trailCountry?: string | undefined;

  /** GPX */
  gpx?: string | undefined;

  /** Highlights */
  highlights?: Document | undefined;

  /** Supplies */
  supplies?: Document | undefined;

  /** Camping */
  camping?: Document | undefined;

  /** Transport */
  transport?: Document | undefined;

  /** General Notes */
  generalNotes?: Document | undefined;

  /** Heritage and History */
  heritageAndHistory?: Document | undefined;

  /** Gallery */
  gallery?: Asset[] | undefined;

  /** Distance */
  distance?: string | undefined;

  /** Grade */
  grade?: string | undefined;

  /** Days */
  days?: string | undefined;

  /** Total Ascent */
  ascent?: string | undefined;

  /** Total Descent */
  descent?: string | undefined;
}

/** Complete routes in their own individual 'route' page. See sticky note for individual work */

export interface IRoute extends Entry<IRouteFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: "route";
        linkType: "ContentType";
        type: "Link";
      };
    };
  };
}

export interface IThumbnailFields {
  /** Slug */
  slug?: string | undefined;

  /** Title */
  title?: string | undefined;

  /** Location */
  location?: string | undefined;

  /** featuredImage */
  featuredImage?: Asset | undefined;

  /** Description */
  description?: string | undefined;

  /** date */
  date?: string | undefined;

  /** date */
  attributions?: string | undefined;

  /** posted */
  posted: string;

  /** PrefaceDescription */
  prefaceDescription?: string | undefined;

  /** DayOneDescription */
  dayOneDescription?: string | undefined;

  /** ImageBlock-1 */
  imageBlock1?: Asset[] | undefined;

  /** DayTwoDescription */
  dayTwoDescription?: string | undefined;

  /** ImageBlock-2 */
  imageBlock2?: Asset[] | undefined;

  /** DayThreeDescription */
  dayThreeDescription?: string | undefined;

  /** ImageBlock-3 */
  imageBlock3?: Asset[] | undefined;

  /** DayFourDescription */
  dayFourDescription?: string | undefined;

  /** ImageBlock-4 */
  imageBlock4?: Asset[] | undefined;

  /** DayFiveDescription */
  dayFiveDescription?: string | undefined;

  /** ImageBlock-5 */
  imageBlock5?: Asset[] | undefined;

  /** GearDescription */
  gearDescription?: string | undefined;

  /** Map */
  map?: string | undefined;

  /** TravelDescription */
  travelDescription?: string | undefined;

  /** AboutDescription */
  aboutDescription?: string | undefined;

  /** LighterPackLink */
  lighterpackLink?: string | undefined;

  /** LighterPackId */
  lighterpackId?: string | undefined;
}

/** Long, detailed and sequenced day-by-day recounts of my hiking trips. */

export interface IThumbnail extends Entry<IThumbnailFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: "thumbnail";
        linkType: "ContentType";
        type: "Link";
      };
    };
  };
}

export type CONTENT_TYPE =
  | "banner"
  | "entries"
  | "photoCollection"
  | "route"
  | "thumbnail";

export type IEntry =
  | IBanner
  | IEntries
  | IPhotoCollection
  | IRoute
  | IThumbnail;

export type LOCALE_CODE = "en-US";

export type CONTENTFUL_DEFAULT_LOCALE_CODE = "en-US";
