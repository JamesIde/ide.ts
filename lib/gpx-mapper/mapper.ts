import { wallsofj } from "data/gpx/walls-of-jerusalem-2022";
import { westernarthurs } from "data/gpx/western-arthurs-2022";
import { wildsouthcoastway } from "data/gpx/wild-south-coast-way-2021";
import { yosemite } from "data/gpx/yosemite-2024";

type GpxMap = Record<string, string>;

/**
 * This map will match the slug of the record to a gpx file. The Mapbox component will then parse the string as
 * geo json for display.
 *
 * Figured it was easier than having to import the gpx files into Contentful. As these gpx files can be huge.
 * Its also easier to maintain from the codebase than Contentful.
 *
 * It does mean each new record needs to have a gpx file added to the repository.
 */
export const GPX_MAPPER: GpxMap = {
  "the-wild-south-coast-way": wildsouthcoastway,
  "backpacking-yosemite-valley-loop": yosemite,
  "the-western-arthurs-traverse": westernarthurs,
  "walls-of-jerusalem": wallsofj,
};
