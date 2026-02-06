import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 mt-20 py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/">
              <img
                className="w-[120px] object-contain mb-4"
                src={assets.logo}
                alt="Superio Logo"
              />
            </Link>
            <p className="text-gray-600 text-sm max-w-md">
              Your trusted platform for connecting talent with opportunities. Find your dream job or hire the perfect candidate.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-blue-600 text-sm transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/all-jobs/all" className="text-gray-600 hover:text-blue-600 text-sm transition">
                  All Jobs
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-blue-600 text-sm transition">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-blue-600 text-sm transition">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Get Started</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/candidate-login" className="text-gray-600 hover:text-blue-600 text-sm transition">
                  Candidate Login
                </Link>
              </li>
              <li>
                <Link to="/recruiter-login" className="text-gray-600 hover:text-blue-600 text-sm transition">
                  Recruiter Login
                </Link>
              </li>
              <li>
                <Link to="/candidate-signup" className="text-gray-600 hover:text-blue-600 text-sm transition">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="transition-transform hover:scale-110"
              aria-label="Facebook"
            >
              <img
                src={assets.facebook_icon}
                alt="Facebook"
                className="h-6 w-6 object-contain"
              />
            </a>
            <a
              href="#"
              className="transition-transform hover:scale-110"
              aria-label="Twitter"
            >
              <img
                src={assets.twitter_icon}
                alt="Twitter"
                className="h-6 w-6 object-contain"
              />
            </a>
            <a
              href="#"
              className="transition-transform hover:scale-110"
              aria-label="Instagram"
            >
              <img
                src={assets.instagram_icon}
                alt="Instagram"
                className="h-6 w-6 object-contain"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

