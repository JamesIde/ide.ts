import CDNImage from "components/Image/CDNImage";
import { Asset } from "contentful";
import Image from "next/image";
function ImageGrid({ images, slug, onImageClick }) {
  if (!images) return null;

  return (
    <div className="record-grid">
      {images.map((photo: Asset) => {
        const config = getImageConfig(photo);

        return (
          <CDNImage
            key={photo.fields.file.fileName}
            height={config.height}
            width={config.width}
            alt={photo.fields.description}
            url={`records/${slug}/${photo.fields.file.fileName}`}
            style={{
              objectFit: "cover",
              height: "100%",
              width: "100%",
            }}
            className={config.className + "hover:cursor-pointer duration-500 hover:border-blue-500 border-2"}
            onClick={(e) =>
              onImageClick(
                e,
                `records/${slug}/${photo.fields.file.fileName}`,
                config.width,
                config.height,
                photo.fields.description
              )
            }
          />
        );
      })}
    </div>
  );
}
export default ImageGrid;

const getImageConfig = (photo: Asset) => {
  const { height, width } = photo.fields.file.details.image || {};

  // Portrait X100VI photos or very tall images (span 2 vertically)
  if ((height >= 4000 && width === 3024) || height > 5700) {
    return {
      className: "record-img-span2 hover:cursor-pointer duration-500",
      width: 1080,
      height: 1920,
    };
  }

  // Square high-res images
  if (height >= 4000 && width === 4000) {
    return {
      className: "record-img hover:cursor-pointer",
      width: width,
      height: height,
    };
  }

  // Default/landscape images rendered as 2k images
  return {
    className: "record-img hover:cursor-pointer duration-500",
    width: 1440,
    height: 2560,
  };
};
