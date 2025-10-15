function CDNImage({
  url,
  width,
  height,
  quality = 85,
  alt,
  onClick,
  style,
  className,
}: {
  url: string;
  width: number;
  height: number;
  quality?: number;
  alt: string;
  onClick?: (e: any) => void;
  style?: any;
  className?: any;
}) {
  const cdnUrl = `${process.env.NEXT_PUBLIC_BASE_CDN_URL}${url}?h=${height}&w=${width}&q=${quality}`;

  return (
    <img
      src={cdnUrl}
      width={width}
      height={height}
      alt={alt}
      decoding="async"
      key={url}
      style={style}
      className={className}
      onClick={onClick}
    />
  );
}

export default CDNImage;
