import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import image9 from "../../assets/meno.png";
import image10 from "../../assets/preg.png";
import image11 from "../../assets/hair.png";

const ServicesSection = () => {
  const ref = useRef(null); 
  const isInView = useInView(ref, { once: false });

  const services = [
    { title: "Pregnancy", path: "/pregnancy", img: image9 },
    { title: "PCOD/PCOS", path: "/pcod-pcos", img: image10 },
    { title: "Menopause", path: "/menopause", img: image11 },
  ];

  return (
    <motion.div ref={ref} className="h-screen herobody min-h-screen px-8 bg-cover bg-center">
      <div className="max-w-6xl mx-auto text-center mt-25">
        <motion.h2
          className="text-5xl font-bold text-gray-800 mb-12"
          initial={{ y: -50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: -50, opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          SERVICES WE OFFER
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 1 }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-white bg-opacity-80 rounded-2xl shadow-xl p-6 flex flex-col items-center transition transform hover:scale-105 hover:shadow-2xl w-[350px] h-[400px]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              whileHover={{
                scale: 1.1,
                boxShadow: "0px 0px 20px rgba(255, 105, 180, 0.8)",
              }}
            >
              <motion.img
                src={service.img}
                alt={service.title}
                className="w-80 h-80 object-contain mb-6"
                whileHover={{ scale: 1.1 }}
              />
              <Link to={service.path}>
                <motion.span
                  className="mt-auto px-6 py-2 bg-pink-400 text-white rounded-full font-semibold tracking-wide cursor-pointer hover:bg-pink-500 transition"
                  whileHover={{ scale: 1.05 }}
                >
                  {service.title}
                </motion.span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ServicesSection;
