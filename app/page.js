"use client";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <Image
                src="/images/logo.png"
                alt="knPOS Logo"
                width={40}
                height={40}
                className="cursor-pointer brightness-0 invert hover:opacity-80 transition-opacity duration-200"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              />
              <div className="hidden md:flex space-x-8">
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-white hover:text-gray-200 font-medium transition-colors duration-200"
                >
                  About Us
                </button>
                <button
                  onClick={() => scrollToSection("customers")}
                  className="text-white hover:text-gray-200 font-medium transition-colors duration-200"
                >
                  Our Customers
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium shadow-sm"
              >
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16">
        {/* Hero Section */}
        <div id="hero" className="text-center mt-8 mb-16 pt-8">
          <Image
            src="/images/logo.png"
            alt="knPOS Logo"
            width={240}
            height={240}
            className="mx-auto hover:scale-105 transition-transform duration-200"
          />
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mt-6">
            Welcome to knPOS
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            knPOS is a powerful and user-friendly POS system designed for
            restaurants and businesses. We provide seamless analytics
            management, inventory tracking, and customer engagement tools to
            help you succeed.
          </p>
        </div>

        {/* About Us Section */}
        <div id="about" className="mb-16 pt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            About Us
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 text-center mb-12">
            We are a dedicated team of developers passionate about providing
            businesses with the best POS solutions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Kris Ambrosini",
                image: "/images/kris.jpg",
                description:
                  "Software engineer specializing in web-based POS systems.",
              },
              {
                name: "Pavel Ponomarev",
                image: "/images/pavel.jpg",
                description:
                  "Backend expert focused on system architecture and security.",
              },
              {
                name: "Noe Adibou Kieffer",
                image: "/images/noe.jpg",
                description:
                  "UI/UX designer ensuring an intuitive user experience.",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="text-center bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="w-32 h-32 mx-auto relative">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill={true}
                    className="rounded-full object-cover"
                    style={{ objectPosition: "center" }}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mt-4">
                  {member.name}
                </h3>
                <p className="mt-2 text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Customers Section */}
        <div id="customers" className="mb-16 pt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Our Customers
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 text-center mb-12">
            We are proud to have worked with amazing businesses, like Hinkali
            Georgian Restaurant, to implement knPOS and improve their
            operations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                image: "/images/customer1.jpg",
                description:
                  "Hinkali Georgian restaurant in Huahin using knPOS for seamless order management.",
              },
              {
                image: "/images/customer2.jpg",
                description:
                  "Optimizing their table management and inventory with our system.",
              },
              {
                image: "/images/customer3.jpg",
                description: "A kitchen display to manage orders to be cooked.",
              },
            ].map((customer, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
              >
                <Image
                  src={customer.image}
                  alt={`Customer ${index + 1}`}
                  width={300}
                  height={200}
                  className="rounded-lg w-full h-48 object-cover"
                />
                <p className="mt-4 text-gray-600">{customer.description}</p>
              </div>
            ))}
          </div>
        </div>

        <footer className="py-12 border-t bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Company Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  knPOS
                </h3>
                <p className="text-gray-600 mb-4">
                  Making restaurant management simple and efficient.
                </p>
                <Image
                  src="/images/logo.png"
                  alt="knPOS Logo"
                  width={80}
                  height={80}
                  className="mb-4 hover:scale-105 transition-transform duration-200"
                />
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Us
                </h3>
                <div className="space-y-3 text-gray-600">
                  <p className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    contact@knpos.com
                  </p>
                  <p className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    +66 98 765 4321
                  </p>
                  <p className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Hua Hin, Thailand
                  </p>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Follow Us
                </h3>
                <div className="flex space-x-4">
                  <a
                    href="https://github.com/pavel10212/knpos-web"
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
              &copy; {new Date().getFullYear()} knPOS. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
