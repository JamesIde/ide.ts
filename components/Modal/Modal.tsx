import Image from "next/image";
import { ModalImage } from "../../@types/Modal";

export default function Modal({ currImage, id, onClose }: { currImage: ModalImage; id: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative max-w-[90vw]">
        <Image
          src={currImage.url}
          alt={id}
          width={parseInt(currImage.width)}
          height={parseInt(currImage.height)}
          className={"max-w-full max-h-[90vh] object-contain transition-opacity duration-300 opacity-100"}
          quality={100}
          priority
        />
        <button onClick={onClose} className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2">
          ✕
        </button>
      </div>
      {currImage.description && (
        <div className="absolute bottom-4 left-4 right-4 text-white text-center">
          <p className="text-sm sm:text-base">{currImage.description}</p>
        </div>
      )}
    </div>
  );
}
