import Link from "next/link";
import React from "react";

const page = () => {
  return <div>
    <Link
      href={'/admin/dashboard'}
    >Proceed to dashboard!</Link>
  </div>;
};

export default page;
