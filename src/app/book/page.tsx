import FishonDP from "@/aset/img/fishonDP.png";
import HeroWallPaper from "@/aset/img/wallpaper02.png";
import PopularDestination from "@/components/PopularDestination";
import SearchBox from "@/components/SearchBox";
import Image from "next/image";
import { Suspense } from "react";
import Link from "next/link";
import BrowseByType from "./BrowseByType";
import TopTechniques from "./TopTechniques";
import TripsNearby from "./TripsNearby";
import { getCharters } from "@/lib/charter-service";

export default async function Home() {
  const charters = await getCharters();
  return (
    <div className="font-sans flex min-h-screen flex-col items-center">
      <main className="flex w-full flex-col items-center sm:items-start gap-8 md:gap-10 mb-24 ">
        {/* In /book/page.tsx (simplified idea) */}
        <section className="relative w-full ">
          {/* wallpaper */}
          <Image
            src={HeroWallPaper}
            alt="Fishing wallpaper"
            className="w-full h-[50vh] md:h-[60vh] object-cover"
            priority
          />
          <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#ec2227] to-white/0 h-1/2"></div>
          <div className="absolute bottom-16 w-full flex justify-center">
            <div className="p-5 flex-col flex max-w-6xl w-full">
              <h2 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
                Discover top-rated <br /> fishing charters
              </h2>
              <h3 className="font-bold text-xl md:text-3xl text-white drop-shadow-lg">
                Book your next fishing trip
              </h3>
            </div>
          </div>
          {/* overlayed search box */}
          <div className="absolute inset-x-0 -bottom-10 lg:-bottom-10 mx-auto px-3 max-w-6xl py-3">
            <Suspense
              fallback={
                <div className="w-full flex flex-col bg-white p-3 rounded-lg gap-3 shadow-lg min-h-16" />
              }
            >
              <SearchBox />
            </Suspense>
          </div>
        </section>
        <div className="flex w-full -mt-10 pt-20 pb-10 justify-center mx-auto bg-[#ec2227]">
          <Suspense
            fallback={
              <div className="mx-auto w-full max-w-6xl px-5 py-7 text-white/80">
                Loading nearby trips…
              </div>
            }
          >
            <TripsNearby charters={charters} />
          </Suspense>
        </div>
        <PopularDestination />

        {/* Brand explainer + CTA */}
        <section className="w-full bg-gray-100">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 p-5 md:flex-row">
            <div className="flex-1">
              <h3 className="text-lg font-bold">
                FishOn.my — Malaysia&apos;s first online fishing booking
                platform
              </h3>
              <p className="mt-1 text-sm text-gray-700">
                FishOn.my is Malaysia&apos;s first online fishing booking
                platform and marketplace helping anglers find and book fishing
                charters. Explore trips across lakes, rivers, inshore and
                offshore destinations around Malaysia — plan, book, fish.
              </p>
            </div>

            <div className="flex items-center gap-5">
              <div className="relative ml-auto h-40 w-40 md:h-56 md:w-56">
                <Image
                  src={FishonDP}
                  alt="Fishon brand graphic"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 160px, 224px"
                  priority
                />
              </div>

              <div className="flex flex-col justify-center">
                <h3 className="font-bold">List your business on FishOn</h3>
                <p className="text-sm text-gray-700">
                  Find customers and earn more
                </p>
                <Link
                  href="/list-your-business"
                  className="mt-5 w-full rounded-md bg-[#ec2227] p-2 text-center font-bold text-white transition hover:bg-red-700"
                >
                  List With Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Browse by type */}
        <BrowseByType charters={charters} />

        {/* Top fishing techniques */}
        <TopTechniques charters={charters} />
      </main>
    </div>
  );
}
