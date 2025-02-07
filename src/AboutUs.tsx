import React from 'react';
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Video Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Project Overview</h2>
          <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
              Project Presentation Video
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-3xl font-bold mb-8">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-blue-600 mb-3">{member.role}</p>
                  <p className="text-gray-600 mb-4">{member.description}</p>
                  <div className="flex space-x-4">
                    <a href={member.links.github} className="text-gray-600 hover:text-gray-900">
                      <LucideGithub size={20} />
                    </a>
                    <a href={member.links.linkedin} className="text-gray-600 hover:text-gray-900">
                      <Linkedin size={20} />
                    </a>
                    <a href={member.links.email} className="text-gray-600 hover:text-gray-900">
                      <Mail size={20} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;