import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="flex flex-col items-center space-y-8">
        <Image
          src="/images/logo.png"
          alt="knPOS Logo"
          width={200}
          height={200}
          className="mb-4"
        />
        <h1 className="text-4xl font-bold text-white mb-8">Welcome to knPOS</h1>
        <div className="flex flex-row items-center space-x-6">
          <Link 
            href="/admin" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Admin Portal
          </Link>
          <Link 
            href="/customer" 
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Customer Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
