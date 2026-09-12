import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const NotFound = () => (
  <main className="min-h-screen bg-white px-6 py-32 text-center text-black">
    <SEO
      title="Page Not Found"
      description="The requested page could not be found."
      noindex
    />
    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
      Error 404
    </p>
    <h1 className="mb-4 text-4xl font-semibold">Page not found</h1>
    <p className="mx-auto mb-8 max-w-lg text-gray-600">
      The page may have moved or the address may be incorrect.
    </p>
    <Link
      to="/"
      className="inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold text-white"
    >
      Return home
    </Link>
  </main>
);

export default NotFound;
