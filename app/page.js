import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Welcome to knPOS!</h1>
      <div className="flex flex-row items-center justify-center">
        <Link href={"/admin"}>Click here for admin</Link>
        <Link href={"/customer"}>Click here for customer</Link>
      </div>
    </div>
  );
}
