import Image from "next/image";
import { ModalImage } from "../../@types/Modal";
export default function Modal({
  currImage,
  id,
}: {
  currImage: ModalImage;
  id: string;
}) {
  return (
    <div className="fixed flex justify-center items-center h-screen top-0 left-0 bg-blurred flex-col">
      <div>
        <Image
          src={currImage.url}
          className="cursor-pointer  h-[96vh] object-contain"
          alt={id}
          key={id}
          width={parseInt(currImage.width)}
          height={parseInt(currImage.height)}
          loading="eager"
        />
      </div>
      <div>
        <p className="text-white text-center ">{currImage.description}</p>
      </div>
    </div>
  );
}
