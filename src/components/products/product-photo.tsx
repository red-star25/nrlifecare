import Image from "next/image";

type ProductPhotoProps = {
  image?: string;
  name: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

function resolveSrc(image: string) {
  if (/^https?:\/\//i.test(image)) return image;
  return `/products/${image}`;
}

/**
 * A product photograph, where one exists.
 *
 * `image` may be a local filename under /public/products, or a full Sanity CDN
 * URL after a cms:pull. Pages always work without a photo.
 */
export function ProductPhoto({
  image,
  name,
  className = "",
  sizes = "(min-width: 1024px) 460px, 100vw",
  priority = false,
}: ProductPhotoProps) {
  if (!image) return null;

  return (
    <Image
      src={resolveSrc(image)}
      alt={name}
      width={1100}
      height={1100}
      priority={priority}
      sizes={sizes}
      className={className}
    />
  );
}
