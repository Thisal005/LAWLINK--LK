import React from "react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "John Doe",
      role: "Client",
      comment: "LawLinkLK connected me with the perfect lawyer—highly recommended!",
    },
    {
      name: "Jane Smith",
      role: "Lawyer",
      comment: "This platform has boosted my client connections and practice growth.",
    },
    {
      name: "Alice Johnson",
      role: "Client",
      comment: "Seamless process—I got help fast and efficiently.",
    },
    {
      name: "Bob Brown",
      role: "Lawyer",
      comment: "A fantastic way to showcase expertise and find clients.",
    },
    {
      name: "Charlie Davis",
      role: "Client",
      comment: "Found a lawyer who truly understood my needs.",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-16">
          Testimonials
        </h2>
        <div className="overflow-hidden relative">
          <div
            className="whitespace-nowrap"
            style={{
              display: "inline-block",
              animation: "scroll 25s linear infinite",
            }}
          >
            <div className="inline-flex space-x-6">
              {/* Render testimonials twice for seamless looping */}
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div
                  key={index}
                  className="group inline-block bg-white/90 backdrop-blur-lg rounded-2xl shadow-md border border-gray-200/50 p-6 w-80 max-h-64 flex-shrink-0 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                >
                  <p className="text-gray-600 mb-4 text-base break-words whitespace-normal">
                    "{testimonial.comment}"
                  </p>
                  <p className="text-blue-600 font-semibold text-base group-hover:text-blue-700 transition-colors duration-200">
                    {testimonial.name}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {testimonial.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Inline styles for the animation */}
      <style>
        {`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          /* Pause animation on hover */
          section:hover .whitespace-nowrap {
            animation-play-state: paused;
          }
        `}
      </style>
    </section>
  );
};

export default Testimonials;