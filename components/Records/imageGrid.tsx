import { Asset } from "contentful";
import Image from "next/image";
function ImageGrid({ images, onImageClick }) {
  if (!images) return null;

  return (
    <div className="record-grid">
      {images.map((photo: Asset) => {
        const config = getImageConfig(photo);

        return (
          <Image
            src={`https:${photo.fields.file.url}`}
            alt={photo.fields.description}
            className={config.className}
            width={config.width}
            height={config.height}
            style={{
              objectFit: "cover",
              height: "100%",
              width: "100%",
            }}
            key={photo.sys.id}
            onClick={(e) => onImageClick(e, photo)}
          />
        );
      })}
    </div>
  );
}
export default ImageGrid;

const getImageConfig = (photo: any) => {
  const { height, width } = photo.fields.file.details.image || {};

  // Portrait X100VI photos or very tall images (span 2 vertically)
  if ((height >= 4000 && width === 3024) || height > 5700) {
    return {
      className: "record-img-span2 hover:cursor-pointer duration-500",
      width: 500,
      height: 1000,
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

  // Default/landscape images
  return {
    className: "record-img hover:cursor-pointer duration-500",
    width: 1920,
    height: 1080,
  };
};
