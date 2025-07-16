import React from "react";
import {
  FaPaw,
  FaCapsules,
  FaStethoscope,
  FaMicroscope,
  FaComments,
  FaBone,
  FaTruckMedical,
  FaHouse,
  FaBath,
  FaBullhorn,
  FaUserDoctor,
  FaXRay,
  FaBox,
  FaHeartPulse
} from "react-icons/fa6";

const services = [
  {
    icon: <FaCapsules className="text-sky-500 text-5xl mb-4 drop-shadow" />,
    title: "PHARMACY",
    desc: "Onsite pharmacy facilities."
  },
  {
    icon: <FaPaw className="text-sky-500 text-5xl mb-4 drop-shadow" />,
    title: "POST MORTEM",
    desc: "Post mortem examinations."
  },
  {
    icon: <FaBullhorn className="text-sky-500 text-5xl mb-4 drop-shadow" />,
    title: "PUBLIC AWARENESS",
    desc: "Public awareness programs on safety and occupational health hazard."
  },
  {
    icon: <FaUserDoctor className="text-sky-500 text-5xl mb-4 drop-shadow" />,
    title: "ADVISING",
    desc: "Advising on animal behaviors, animal restraining & emergency health care."
  },
  {
    icon: <FaStethoscope className="text-sky-500 text-5xl mb-4 drop-shadow" />,
    title: "MEDICINE & TREATMENTS",
    desc: "Companion animal medicine, diagnosis, treatments and preventive measures."
  },
  {
    icon: <FaBone className="text-sky-500 text-5xl mb-4 drop-shadow" />,
    title: "ANIMAL SURGERIES",
    desc: "Companion animal surgeries."
  },
  {
    icon: <FaMicroscope className="text-sky-500 text-5xl mb-4 drop-shadow" />,
    title: "LABORATORY",
    desc: "Laboratory facilities for disease diagnosis."
  },
  {
    icon: <FaComments className="text-sky-500 text-5xl mb-4 drop-shadow" />,
    title: "COUNSELING",
    desc: "Counseling pet owners for regular vaccinations, deworming and zoonotic diseases."
  },
  {
    icon: <FaBox className="text-sky-500 text-5xl mb-4 drop-shadow" />,
    title: "FOODS & ACCESSORIES",
    desc: "Availability of pet foods and various pet accessories."
  },
  {
    icon: <FaTruckMedical className="text-sky-500 text-5xl mb-4 drop-shadow" />,
    title: "MOBILE SERVICE",
    desc: "Treatment of your pet at your doorstep! Just call us to make an appointment."
  },
  {
    icon: <FaHouse className="text-sky-500 text-5xl mb-4 drop-shadow" />,
    title: "BOARDING & WARDING",
    desc: "We are providing boarding and warding facilities for your pet."
  },
  {
    icon: <FaBath className="text-sky-500 text-5xl mb-4 drop-shadow" />,
    title: "GROOMING & BATHING",
    desc: "We are providing grooming and bathing services."
  },
  {
    icon: <FaHeartPulse className="text-sky-500 text-5xl mb-4 drop-shadow" />,
    title: "SCAN",
    desc: "We have all facilities for 3D Ultrasound Scanning."
  },
  {
    icon: <FaXRay className="text-sky-500 text-5xl mb-4 drop-shadow" />,
    title: "X-RAY",
    desc: "We are pleased to offer X-Ray services as a means of providing excellent care to our pets."
  }
];

const Services = () => (
  <div className="max-w-7xl mx-auto px-4 py-16">
    <div className="text-center mb-12">
      <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400 mb-4 tracking-tight drop-shadow-lg">
        OUR SERVICES
      </h2>
      <h3 className="text-2xl md:text-3xl font-bold text-gray-700 mb-4 tracking-tight">
        THE BEST PLACE TO FULFILL ALL YOUR PET NEEDS.
      </h3>
      <div className="flex justify-center mt-2 mb-2">
        <span className="inline-block w-28 h-1 rounded bg-gradient-to-r from-blue-400 to-blue-600"></span>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
      {services.map((service, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-blue-50"
        >
          {service.icon}
          <h4 className="text-lg font-bold text-gray-800 mb-2 uppercase tracking-wide">{service.title}</h4>
          <p className="text-gray-500 text-center text-base">{service.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Services;