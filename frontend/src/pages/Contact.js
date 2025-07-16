import React from "react";
import { FaPhone, FaEnvelope, FaFacebookF, FaGoogle } from "react-icons/fa6";

const Contact = () => (
  <div className="max-w-5xl mx-auto px-4 py-16">
    <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400 mb-8 tracking-tight drop-shadow-lg text-center">
      CONTACT US
    </h2>
    <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl border border-blue-100">
      <iframe
        title="CityPet Location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63313.34832467647!2d79.993209!3d6.900934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25f2e6b2e0e7b%3A0x7a2e2b8e6e2e2e2e!2sCity%20Pet%20Animal%20Hospital%20Athurugiriya!5e0!3m2!1sen!2slk!4v1689599999999!5m2!1sen!2slk"
        width="100%"
        height="350"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
      {/* Main Hospital */}
      <div className="bg-white rounded-xl shadow p-8 border border-blue-50 hover:shadow-lg transition">
        <h3 className="text-2xl font-bold text-blue-700 mb-2 tracking-wide">MAIN HOSPITAL</h3>
        <p className="font-semibold text-gray-800 text-lg mb-1">CityPet, Athurugiriya</p>
        <p className="text-gray-600 mb-2">No. 137/1, Kaduwela Road,<br />Athurugiriya. Sri Lanka.</p>
        <div className="mt-2 flex items-center gap-2 text-gray-700 text-base">
          <FaPhone className="inline text-blue-500" /> <span>P: (011) 2054074</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700 text-base">
          <FaPhone className="inline text-blue-500" /> <span>M: (071) 8419273</span>
        </div>
      </div>
      {/* Branch Hospital */}
      <div className="bg-white rounded-xl shadow p-8 border border-blue-50 hover:shadow-lg transition">
        <h3 className="text-2xl font-bold text-blue-700 mb-2 tracking-wide">BRANCH HOSPITAL</h3>
        <p className="font-semibold text-gray-800 text-lg mb-1">CityPet, Kottawa Branch</p>
        <p className="text-gray-600 mb-2">No. 133/2E, High level Road,<br />Kottawa. Sri Lanka.</p>
        <div className="mt-2 flex items-center gap-2 text-gray-700 text-base">
          <FaPhone className="inline text-blue-500" /> <span>M: (077) 7901213</span>
        </div>
      </div>
    </div>
    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
      <div>
        <h4 className="font-bold text-gray-700 text-lg mb-1">Opening Hours</h4>
        <p className="text-gray-600">Everyday <span className="font-medium text-blue-600">(9.00 AM – 12.30 PM and 4.30 PM - 8.30 PM)</span></p>
      </div>
      <div>
        <h4 className="font-bold text-gray-700 text-lg mb-1">Email</h4>
        <a href="mailto:info@citypet.lk" className="text-blue-500 underline text-base hover:text-blue-700 transition">info@citypet.lk</a>
      </div>
    </div>
    <div className="text-center mt-10">
      <h4 className="font-bold text-gray-700 text-lg mb-3">We're on social networks</h4>
      <div className="flex justify-center gap-6">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white p-4 rounded-full shadow hover:bg-blue-700 transition text-xl">
          <FaFacebookF />
        </a>
        <a href="https://plus.google.com" target="_blank" rel="noopener noreferrer" className="bg-black text-white p-4 rounded-full shadow hover:bg-gray-800 transition text-xl">
          <FaGoogle />
        </a>
      </div>
    </div>
  </div>
);

export default Contact;