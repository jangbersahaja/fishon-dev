import Link from "next/link";
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa6";

const socials = [
  {
    name: "Facebook",
    icon: <FaFacebook />,
    link: "https://www.facebook.com/profile.php?id=61580228252347",
  },
  {
    name: "Instagram",
    icon: <FaInstagram />,
    link: "",
  },
  {
    name: "Tiktok",
    icon: <FaTiktok />,
    link: "",
  },
  {
    name: "Whatsapp",
    icon: <FaWhatsapp />,
    link: "https://wa.me/60165304304?text=Nak%20Fishon",
  },
];

const abouts = [
  {
    name: "About Us",
    link: "/about",
  },
  {
    name: "Blog",
    link: "",
  },
  {
    name: "Affiliate Program",
    link: "",
  },
  {
    name: "Contact Us",
    link: "/contact",
  },
  {
    name: "Safety",
    link: "/safety",
  },
];

const discover = [
  {
    name: "Fishing Technique",
    link: "/categories/techniques",
  },
  {
    name: "Fishing Type",
    link: "/categories/types",
  },
  {
    name: "Fish Species",
    link: "",
  },
  {
    name: "Fish Near Me",
    link: "",
  },
];

const support = [
  {
    name: "Help Center",
    link: "/support/help",
  },
  {
    name: "Term of Use",
    link: "/support/terms",
  },
  {
    name: "Privacy Policy",
    link: "/support/privacy",
  },
];

const Footer = () => {
  return (
    <main className="flex flex-col w-full mt-10  bg-gray-100">
      <section className="mx-auto w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 px-5 py-10 gap-7">
        <div className="flex flex-col gap-3 text-sm">
          <span className="font-bold">About FishOn.my</span>
          <ul className="flex flex-col gap-2">
            {abouts.map((a) => (
              <li key={a.name}>
                <Link href={a.link}>
                  {a.link != "" ? a.name : a.name + " (not ready)"}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <span className="font-bold">Discover</span>
          <ul className="flex flex-col gap-2">
            {discover.map((a) => (
              <li key={a.name}>
                <Link href={a.link}>
                  {a.link != "" ? a.name : a.name + " (not ready)"}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <span className="font-bold">Site Map</span>
          <ul className="flex flex-col gap-2">
            <li>All Destination</li>
            <li>Selangor</li>
            <li>Perak</li>
          </ul>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <span className="font-bold">Support</span>
          <ul className="flex flex-col gap-2">
            {support.map((a) => (
              <li key={a.name}>
                <Link href={a.link}>
                  {a.link != "" ? a.name : a.name + " (not ready)"}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <span className="font-bold">Become a Captain</span>
          <ul className="flex flex-col gap-2">
            <li>List Your Boat</li>
          </ul>
        </div>
      </section>
      <section className="w-full bg-[#ec2227] ">
        <div className="mx-auto w-full max-w-6xl flex h-24 flex-wrap items-center justify-between gap-3 text-white/90 px-5 py-3">
          <h3 className="font-bold">© 2025 Fishon. All rights reserved.</h3>
          <nav aria-label="Social links">
            <ul className="flex items-center gap-4 text-xl">
              {/* Add more links as they go live */}
              {socials.map((s) => (
                <li key={s.name}>
                  <Link
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-white/40 underline-offset-4 hover:decoration-white"
                  >
                    {s.icon}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </main>
  );
};

export default Footer;
