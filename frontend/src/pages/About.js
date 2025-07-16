import React from 'react';

const staff = [
  {
    name: "Dr. Sugath Pemachandra",
    title: "Managing Director, Chief Veterinary Surgeon",
    qualifications: [
      { label: "BVSc (SL)", link: "#" },
      { label: "MSLCVS", link: "#" }
    ],
    regNo: "1504",
    image: "https://www.citypet.lk/img/team/1.jpg"
  },
  {
    name: "Dr. Pavithra Eshwara",
    title: "Veterinary Surgeon",
    qualifications: [
      { label: "BVSc (SL)", link: "#" }
    ],
    regNo: "1521",
    image: "https://www.citypet.lk/img/team/2.jpg"
  },
  {
    name: "Dr. Sugandhika Gothami",
    title: "Veterinary Surgeon",
    qualifications: [
      { label: "BVSc (SL)", link: "#" }
    ],
     RegNo:"1654",
    image: "https://www.citypet.lk/img/team/3.jpg"
  }
];

const About = () => (
  <div className="max-w-6xl mx-auto px-4 py-12">
    <div className="text-center mb-12">
  <div className="flex justify-center mb-4">
    <span className="animate-bounce text-blue-400 text-3xl">↓</span>
  </div>
  <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text mb-4 tracking-tight drop-shadow-lg">
    WE PROVIDE YOUR PET A HAPPY LIFE WITHOUT DISEASES.
  </h2>
  <p className="text-gray-700 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed mb-2">
    We are an animal hospital located in <span className="font-semibold text-blue-600">Athurugiriya</span>, in the outskirt of Colombo.<br />
    Our hospital is served by three professionally qualified veterinary practitioners.
  </p>
  <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
    We offer all types of services such as <span className="font-medium text-blue-500">geriatric and pediatric care</span>, behavioral and nutritional pet clinic counseling, vaccination, preventive medicine and surgeries, and advising for health and safety plans.
  </p>
  <div className="flex justify-center mt-6">
    <span className="inline-block w-24 h-1 rounded bg-gradient-to-r from-blue-400 to-blue-600"></span>
  </div>
</div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {staff.map((member) => (
        <div key={member.name} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <img
            src={member.image}
            alt={member.name}
            className="w-40 h-40 object-cover rounded-full mb-4 border-4 border-gray-100"
          />
          <h3 className="text-lg font-semibold uppercase text-gray-800 mb-1">{member.name}</h3>
          <p className="text-gray-600 text-center mb-2">{member.title}</p>
          <div>
            {member.qualifications.map((q, idx) => (
              <a
                key={q.label}
                href={q.link}
                className="text-blue-500 underline text-sm mr-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                {q.label}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default About;