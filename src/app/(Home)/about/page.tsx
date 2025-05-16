"use client";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-base-300 rounded-2xl shadow-xl">
      <h1 className="text-4xl font-bold text-center uppercase mb-6">
        About Us
      </h1>
      <div className="space-y-4">
        <p>
          Our platform is designed to assist law enforcement and intelligence
          agencies in identifying and managing suspects using advanced facial
          recognition, AI, and secure data handling.
        </p>
        <p>
          We combine cutting-edge technology like{" "}
          <strong>face recognition</strong>, geolocation tracking, and real-time
          data updates to ensure rapid and accurate identification of persons of
          interest in any case.
        </p>
        <img
          src="/about.png"
          alt="About Us"
          className="rounded-xl w-full object-cover mt-4"
        />
        <p>
          We are committed to helping investigation teams streamline their
          casework and improve public safety with the support of modern tools
          and robust databases.
        </p>
      </div>
    </div>
  );
}
