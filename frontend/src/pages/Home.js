import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuth } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Side: Image */}
            <div className="relative">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1583511655826-05700d52f4d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Happy Dog"
                  className="w-full max-w-md mx-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500 animate-slide-up"
                />
              </div>
              {/* Circular Background Elements with Gradient */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full opacity-40 animate-pulse"></div>
              <div className="absolute top-12 left-24 w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-40 animate-pulse delay-150"></div>
              <div className="absolute bottom-0 left-12 w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full opacity-40 animate-pulse delay-300"></div>
            </div>

            {/* Right Side: Text and Buttons */}
            <div className="text-center md:text-left animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 mb-4">
                Strong & Healthy
              </h1>
              <p className="text-xl text-gray-700 mb-8 font-medium">
                Exceptional care for your furry friends. We make sure they thrive!
              </p>
              <div className="space-x-4">
                {!isAuth && (
                  <>
                    <Link
                      to="/login"
                      className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 animate-bounce"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/register"
                      className="inline-block px-8 py-4 bg-white text-blue-600 border-2 border-blue-500 rounded-full font-semibold shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all duration-300 animate-bounce delay-150"
                    >
                      Register Now
                    </Link>
                  </>
                )}
                {isAuth && (
                  <Link
                    to="/dashboard"
                    className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 animate-bounce"
                  >
                    Go to Dashboard
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Right Circle */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full opacity-30 transform translate-x-1/2 translate-y-1/2"></div>
      </section>

      {/* About Us Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center animate-slide-up">
          About Us
        </h2>
        <div className="max-w-3xl mx-auto bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-100 animate-fade-in">
          <p className="text-gray-600 text-lg text-center leading-relaxed">
            At CityPet, we’re passionate about your pets’ well-being. Our expert veterinarians and caring staff provide top-notch services, from routine check-ups to emergency care, ensuring your furry companions live their happiest, healthiest lives.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center animate-slide-up">
          Our Services
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: 'Veterinary Care',
              description: 'Comprehensive health check-ups and treatments for all pets.',
            },
            {
              title: 'Pet Grooming',
              description: 'Professional grooming to keep your pet looking fabulous.',
            },
            {
              title: 'Emergency Care',
              description: 'Round-the-clock emergency services for urgent needs.',
            },
          ].map((service, index) => (
            <div
              key={service.title}
              className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <h3 className="font-semibold text-xl text-blue-600 mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Nutrition Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center animate-slide-up">
          Nutrition
        </h2>
        <div className="max-w-3xl mx-auto bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-100 animate-fade-in">
          <p className="text-gray-600 text-lg text-center leading-relaxed">
            Discover tailored nutrition plans to keep your pets strong, active, and healthy. We offer expert advice on diets that suit their unique needs.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;