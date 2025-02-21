import { motion } from 'framer-motion';
import { LucideGithub, Linkedin, Mail } from 'lucide-react';

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

const AboutUsPage = () => {
  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "Project Lead",
      image: "/api/placeholder/150/150",
      description: "Aerospace engineer with 10 years of experience in microsatellite development",
      links: { github: "#", linkedin: "#", email: "#" }
    },
    {
      name: "Mark Rodriguez",
      role: "Hardware Engineer",
      image: "/api/placeholder/150/150",
      description: "Specializes in sensor integration and satellite communications systems",
      links: { github: "#", linkedin: "#", email: "#" }
    },
    {
      name: "Dr. James Wilson",
      role: "Software Lead",
      image: "/api/placeholder/150/150",
      description: "Expert in real-time data processing and satellite control systems",
      links: { github: "#", linkedin: "#", email: "#" }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Project Overview */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold mb-8 text-slate-100">Project Overview</h2>
          <div className="aspect-w-16 aspect-h-9 bg-slate-700 rounded-xl overflow-hidden">
            <div className="w-full h-full flex items-center justify-center bg-slate-800/50">
              <span className="text-xl">Project Presentation Video</span>
            </div>
          </div>
        </motion.div>
        
        {/* Team Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-8 text-slate-100">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-slate-700 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all"
              >
                <div className="h-48 bg-slate-800/50">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-slate-100">{member.name}</h3>
                  <p className="text-blue-400 mb-3">{member.role}</p>
                  <p className="text-slate-300 mb-4">{member.description}</p>
                  <div className="flex space-x-4">
                    {Object.entries(member.links).map(([key, url]) => (
                      <a
                        key={key}
                        href={url}
                        className="text-slate-400 hover:text-blue-400 transition-colors"
                      >
                        {key === 'github' && <LucideGithub size={20} />}
                        {key === 'linkedin' && <Linkedin size={20} />}
                        {key === 'email' && <Mail size={20} />}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUsPage;