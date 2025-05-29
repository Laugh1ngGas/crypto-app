import { aboutUsLinks, supportLinks, communityLinks } from "../../constants";

const Footer = () => {
  return (
    <footer className="mt-20 border-t py-10 border-neutral-700">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <h3 className="text-md font-semibold mb-4">About Us</h3>
          <ul className="space-y-2">
            {aboutUsLinks.map((link, index) => (
              <li key={index}>
                <a href={link.href} className="text-neutral-300 hover:text-white">
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-md font-semibold mb-4">Support</h3>
          <ul className="space-y-2">
            {supportLinks.map((link, index) => (
              <li key={index}>
                <a href={link.href} className="text-neutral-300 hover:text-white">
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="order-last lg:order-none">
          <h3 className="text-md font-semibold mb-4">Community</h3>
          <ul
            className="grid grid-cols-4 gap-y-4 lg:w-1/2 sm:w-full">
            {communityLinks.map((link, index) => (
              <li key={index} className="flex justify-start">
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-300 hover:text-white text-xl"
                >
                  {link.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-neutral-700 flex items-center justify-center">
        <p className="text-sm text-neutral-500 mt-10">© 2025 Crypto App</p>
      </div>
    </footer>
  );
};

export default Footer;
