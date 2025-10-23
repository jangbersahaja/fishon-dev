"use client";

interface Captain {
  name: string;
  avatarUrl?: string;
  yearsExperience: number;
  crewCount: number;
  intro?: string;
}

interface StartConversationCardProps {
  captain?: Captain | null;
  charterName?: string;
  location?: string;
  species?: string[];
  techniques?: string[];
  note: string;
  onNoteChange: (value: string) => void;
}

export default function StartConversationCard({
  captain,
  charterName,
  note,
  onNoteChange,
}: StartConversationCardProps) {
  const displayName = captain?.name || charterName || "Your Captain";

  return (
    <section className="p-5 bg-white border rounded-2xl border-black/10 sm:p-6">
      <h2 className="mb-4 text-base font-semibold sm:text-lg">
        Say hello to captain
      </h2>
      {/* Captain Profile */}
      <div className="flex items-start gap-4 ">
        <div className="relative flex-shrink-0 w-16 h-16 overflow-hidden rounded-full shadow-sm ring-2 ring-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={captain?.avatarUrl || "/images/captain.svg"}
            alt={displayName}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="flex-1 min-w-0 ">
          <div className="mb-2">
            <h3 className="font-semibold text-gray-900">{displayName}</h3>

            {captain && (
              <p className="text-xs text-gray-600">
                {captain.yearsExperience} years experience • {captain.crewCount}{" "}
                crew
              </p>
            )}
          </div>
          <p className="p-4 mb-4 text-sm border rounded-b-xl rounded-tr-xl bg-gradient-to-br from-blue-50/50 to-cyan-50/50 border-black/10">
            Hello, welcome to {charterName}. Thanks for your interest! Let me
            know who’ll be joining the trip, what fish you’re aiming to catch,
            and any special requests — I’ll make sure everything’s ready for
            you.
          </p>
        </div>
      </div>

      {/* Message Input */}
      <div>
        <label className="block text-slate-800">
          <textarea
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder={`Introduce yourself to ${
              displayName.split(" ")[0]
            }. Share your fishing experience, what you hope to catch, or any special requests...`}
            rows={4}
            className="w-full px-4 py-3 border border-black/10 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#ec2227] focus:border-transparent transition-shadow"
          />
        </label>
        <p className="mt-2 text-xs text-gray-500">
          This message will be sent to the captain with your booking request.
        </p>
      </div>
    </section>
  );
}
