import Image from "next/image";
import { getChannelMap } from "@/lib/channelId";
import Link from "next/link";

const Page = async () => {
  const channels = await getChannelMap();

  return (
    <div className="">
      <div className="mb-6">
        <h1 className="title">قنوات البث المباشر</h1>
        <p className="subtitle">اختر القناة والجودة لمشاهدة البث المباشر.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 grid-reverse">
        {Object.entries(channels).map(([name, data]) => (
          <div
            key={name}
            className="bg-white rounded-2xl shadow-md border p-6 flex flex-col items-center"
          >
            <img
              src={data.assets.square_logo_url}
              alt={name}
              width={120}
              height={120}
              className="object-contain h-20 mb-4"
            />

            <h2 className="text-lg font-semibold text-center mb-6">{name}</h2>
            <div className="flex gap-2 w-full justify-center flex-wrap">
              {data &&
                Object.entries(data.qualities).map(([name, id]) => (
                  <Link
                    key={id}
                    href={`/live/${id}`}
                    className="flex-1 rounded-lg border rounded-md text-xs text-black transition px-3 py-1 hover:bg-gray-100 text-center font-medium"
                  >
                    {name.toUpperCase()}
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
