import Example1 from "@/aset/img/example1.webp";
import Example2 from "@/aset/img/example2.webp";
import Image from "next/image";
import { GiBoatFishing } from "react-icons/gi";
import { IoIosPin, IoIosStar } from "react-icons/io";

const LatestTrip = () => {
  return (
    <div className="w-full flex mt-[200px] lg:mt-[50px] max-w-7xl justify-center mx-auto">
      <div className="w-full flex flex-col px-5">
        <h2 className="text-xl font-bold mb-5">
          Latest Trip Available For You
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="flex border border-gray-300 p-5 rounded-lg gap-5">
            <div className="flex flex-col">
              <div className="aspect-square h-48 bg-gray-400 relative">
                <Image src={Example1} alt="alt" fill className="object-cover" />
              </div>
              <div className="w-full flex flex-col bg-gray-100 p-2 rounded-b">
                <div className="w-full flex items-center gap-3">
                  <GiBoatFishing className="text-3xl" />
                  <span className="text-sm">12 Ft</span>
                </div>
                <span className="text-xs">Up to 2 people</span>
              </div>
            </div>
            <div className="flex flex-col justify-between w-full">
              <div className="flex flex-col gap-1 text-sm">
                <h4 className="text-lg font-bold">Lunkerlink Fishing Guide</h4>
                <span className="flex items-center gap-1">
                  <IoIosStar className="text-yellow-400" /> (No Reviews)
                </span>
                <span className="flex items-center gap-1">
                  <IoIosPin /> Puchong
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <hr className="border-gray-200" />
                <span className="text-sm">From</span>
                <span className="font-bold text-lg">MYR 420</span>
                <span className="text-xs">per person</span>
                <button className="w-full bg-red-600 text-white p-2 rounded-sm hover:bg-red-700 transition font-bold">
                  View Details
                </button>
              </div>
            </div>
          </div>

          <div className="flex border border-gray-300 p-5 rounded-lg gap-5">
            <div className="flex flex-col">
              <div className="aspect-square h-48 bg-gray-400 relative">
                <Image src={Example2} alt="alt" fill className="object-cover" />
              </div>
              <div className="w-full flex flex-col bg-gray-100 p-2 rounded-b">
                <div className="w-full flex items-center gap-3">
                  <GiBoatFishing className="text-3xl" />
                  <span className="text-sm">12 Ft</span>
                </div>
                <span className="text-xs">Up to 2 people</span>
              </div>
            </div>
            <div className="flex flex-col justify-between w-full">
              <div className="flex flex-col gap-1 text-sm">
                <h4 className="text-lg font-bold">
                  Lunkerlink Fishing Guide – Saltwater Pond
                </h4>
                <span className="flex items-center gap-1">
                  <IoIosStar className="text-yellow-400" /> (No Reviews)
                </span>
                <span className="flex items-center gap-1">
                  <IoIosPin /> Subang Jaya
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <hr className="border-gray-200" />
                <span className="text-sm">From</span>
                <span className="font-bold text-lg">MYR 350</span>
                <span className="text-xs">per person</span>
                <button className="w-full bg-red-600 text-white p-2 rounded-sm hover:bg-red-700 transition font-bold">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestTrip;
