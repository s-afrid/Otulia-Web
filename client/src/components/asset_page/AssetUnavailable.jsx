import React from "react";
import { Link } from "react-router-dom";
import SEO from "../SEO";

const AssetUnavailable = () => (
  <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
    <SEO
      title="Listing Not Found"
      description="This listing is no longer available."
      noindex
    />
    <h1 className="mb-3 text-3xl font-semibold">Listing not found</h1>
    <p className="mb-6 text-gray-500">
      This listing may have been removed or is no longer available.
    </p>
    <Link to="/shop" className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white">
      Browse listings
    </Link>
  </section>
);

export default AssetUnavailable;
