import { motion } from 'framer-motion';
import { LucideGithub, Linkedin, Mail } from 'lucide-react';

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
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Project Overview */}
        <div className="mb-16" data-aos="fade-up">
          <h2 className="text-4xl font-bold mb-8">Project Overview</h2>
          <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden">
            <div className="w-full h-full flex items-center justify-center bg-secondary">
              <span className="text-xl">Project Presentation Video</span>
            </div>
          </div>
        </div>
        
        {/* Team Section */}
        <div data-aos="fade-up">
          <h2 className="text-4xl font-bold mb-8">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all bg-secondary"
                >
                  <div className="h-48">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                    <p className="text-blue-400 mb-3">{member.role}</p>
                    <p className="mb-4">{member.description}</p>
                    <div className="flex space-x-4">
                      {Object.entries(member.links).map(([key, url]) => (
                        <a
                          key={key}
                          href={url}
                          className="hover:text-blue-400 transition-colors"
                        >
                          {key === 'github' && <LucideGithub size={20} />}
                          {key === 'linkedin' && <Linkedin size={20} />}
                          {key === 'email' && <Mail size={20} />}
                        </a>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;