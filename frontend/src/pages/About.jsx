import React from "react";
import Counter from "../components/Counter";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Testimonials from "../components/Testimonials";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { SlideLeft, SlideUp } from "../utils/Animation";

const About = () => {
  return (
    <>
      <Navbar />
      <section>
        <Counter />

        {/* About Section */}
        <div className="mt-16">
          <h1 className="text-3xl md:text-4xl font-semibold mb-8 text-center text-gray-700">
            About Superio - Your Career Gateway
          </h1>
          <div className="max-w-4xl text-center mx-auto space-y-6 text-gray-600">
            <motion.p
              variants={SlideUp(0.3)}
              initial="hidden"
              whileInView="visible"
              className="leading-relaxed"
            >
              Superio is a modern job portal designed to bridge the gap between talented
              candidates and leading companies. We provide a seamless platform where job seekers
              can discover opportunities that match their skills, and recruiters can find the
              perfect candidates for their teams.
            </motion.p>
            <motion.p
              variants={SlideUp(0.5)}
              initial="hidden"
              whileInView="visible"
              className="text-lg leading-relaxed"
            >
              With advanced resume parsing powered by AI, smart filtering capabilities, and
              real-time application tracking, we make the job search and recruitment process
              faster, smarter, and more efficient for everyone.
            </motion.p>
          </div>
        </div>

        <Testimonials />

        {/* How It Works Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-3">
              How It Works?
            </h1>
            <p className="text-lg text-gray-500">Simple, fast, and effective</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Work Step 1 */}
            <motion.div
              variants={SlideLeft(0.2)}
              initial="hidden"
              whileInView="visible"
              className="bg-white p-8 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
            >
              <div className="flex justify-center mb-6">
                <img
                  src={assets.work_1}
                  alt="Resume Assessment"
                  className="h-16 w-16 object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Create Your Profile
              </h3>
              <p className="text-gray-600">
                Sign up and upload your resume. Our AI-powered parser extracts your
                skills, experience, and qualifications automatically.
              </p>
            </motion.div>

            {/* Work Step 2 */}
            <motion.div
              variants={SlideLeft(0.4)}
              initial="hidden"
              whileInView="visible"
              className="bg-white p-8 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
            >
              <div className="flex justify-center mb-6">
                <img
                  src={assets.work_2}
                  alt="Job Fit Scoring"
                  className="h-16 w-16 object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Find Perfect Jobs
              </h3>
              <p className="text-gray-600">
                Browse jobs by category, filter by skills, experience level, and location.
                Apply with one click to positions that match your profile.
              </p>
            </motion.div>

            {/* Work Step 3 */}
            <motion.div
              variants={SlideLeft(0.6)}
              initial="hidden"
              whileInView="visible"
              className="bg-white p-8 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
            >
              <div className="flex justify-center mb-6">
                <img
                  src={assets.work_3}
                  alt="Help Every Step"
                  className="h-16 w-16 object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Track & Get Hired
              </h3>
              <p className="text-gray-600">
                Monitor your application status in real-time. Get instant notifications
                when recruiters review or update your application status.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default About;
