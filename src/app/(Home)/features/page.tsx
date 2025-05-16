"use client";

export default function FeaturesPage() {
  const features = [
    {
      title: "Face Recognition",
      description:
        "Detect and match suspect faces from uploaded images using our intelligent recognition system.",
      icon: "https://img.icons8.com/ios-filled/100/face-id.png",
    },
    {
      title: "Case Linking",
      description:
        "Assign suspects to active cases with geolocation and activity tracking support.",
      icon: "https://img.icons8.com/ios-filled/100/crime.png",
    },
    {
      title: "Real-Time Alerts",
      description:
        "Get notified when a known suspect is detected in any surveillance footage.",
      icon: "https://img.icons8.com/ios-filled/100/alarm.png",
    },
    {
      title: "Detailed Profiles",
      description:
        "Maintain suspect profiles including affiliations, locations, photos, and facial embeddings.",
      icon: "https://img.icons8.com/ios-filled/100/name.png",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 bg-base-300 rounded-2xl shadow-xl">
      <h1 className="text-4xl font-bold text-center uppercase mb-10">
        Features
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-base-200 p-4 rounded-xl flex gap-4 items-start shadow-md"
          >
            <img src={feature.icon} alt={feature.title} className="w-12 h-12" />
            <div>
              <h2 className="text-xl font-semibold">{feature.title}</h2>
              <p>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
