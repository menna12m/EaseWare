'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, Zoom } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';

type Props = {
  images: { url: string; alt?: string }[];
  productTitle: string;
};

export function ProductGallery({ images, productTitle }: Props) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const slides = images.length > 0 ? images : [{ url: '/placeholder.svg', alt: productTitle }];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-xl bg-cream-100">
        <Swiper
          modules={[Navigation, Pagination, Thumbs, Zoom]}
          spaceBetween={0}
          navigation
          zoom
          pagination={{ clickable: true }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          className="aspect-[3/4] w-full"
        >
          {slides.map((img, i) => (
            <SwiperSlide key={i}>
              <div className="swiper-zoom-container relative h-full w-full">
                <Image
                  src={img.url}
                  alt={img.alt ?? `${productTitle} image ${i + 1}`}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {slides.length > 1 && (
        <Swiper
          modules={[Thumbs]}
          onSwiper={setThumbsSwiper}
          spaceBetween={8}
          slidesPerView={5}
          watchSlidesProgress
          className="w-full"
        >
          {slides.map((img, i) => (
            <SwiperSlide key={i} className="cursor-pointer">
              <div className="relative aspect-square overflow-hidden rounded-md bg-cream-100 ring-1 ring-ink/10 [&.swiper-slide-thumb-active]:ring-2 [&.swiper-slide-thumb-active]:ring-clay">
                <Image
                  src={img.url}
                  alt={img.alt ?? `Thumbnail ${i + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
