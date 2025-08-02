import React, { useEffect, useState } from "react";
import { ExternalLink, Star, Quote } from "lucide-react";
import CardGlass from "@/components/ui/CardGlass";
import { Badge } from "@/components/ui/badge";

const PARTNERS = [
  { 
    name: "Polygon", 
    logo: "/assets/partners/polygon.svg", 
    link: "https://polygon.technology",
    description: "Layer 2 scaling solution",
    category: "Infrastructure"
  },
  { 
    name: "Gitcoin", 
    logo: "/assets/partners/gitcoin.svg", 
    link: "https://gitcoin.co",
    description: "Community funding platform",
    category: "Funding"
  },
  { 
    name: "OpenAI", 
    logo: "/assets/partners/openai.svg", 
    link: "https://openai.com",
    description: "AI verification engine",
    category: "AI/ML"
  },
  { 
    name: "Arweave", 
    logo: "/assets/partners/arweave.svg", 
    link: "https://www.arweave.org/",
    description: "Permanent data storage",
    category: "Storage"
  }
];

const TESTIMONIALS = [
  {
    name: "Gitcoin Reviewer",
    quote: "GuardianChain stands out as a truth-preserving protocol with unmatched long-term utility. The grant was well-deserved.",
    role: "Ecosystem Grants Committee",
    avatar: "GR",
    rating: 5
  },
  {
    name: "Polygon Village",
    quote: "A next-gen use case for decentralized memory that fits directly into the sovereign stack.",
    role: "Partner Ecosystem Manager",
    avatar: "PV",
    rating: 5
  },
  {
    name: "Truth Network Validator",
    quote: "The grief-score yield mechanism creates genuine incentives for truth preservation. Revolutionary approach.",
    role: "Network Validator",
    avatar: "TV",
    rating: 5
  }
];

export default function PartnersPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const cycle = setInterval(() => 
      setActiveTestimonial((i) => (i + 1) % TESTIMONIALS.length), 8000
    );
    return () => clearInterval(cycle);
  }, []);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          🤝 Our Partners & Ecosystem
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Building the future of truth preservation with world-class partners
        </p>
      </div>

      {/* Partners Grid */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white text-center">Strategic Partners</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PARTNERS.map((partner) => (
            <CardGlass key={partner.name} hover className="text-center">
              <a
                href={partner.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block space-y-4 group"
              >
                <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <span className="text-2xl font-bold text-white">
                    {partner.name.charAt(0)}
                  </span>
                </div>
                
                <div>
                  <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {partner.name}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">{partner.description}</p>
                </div>

                <Badge variant="secondary" className="text-xs">
                  {partner.category}
                </Badge>

                <ExternalLink className="w-4 h-4 mx-auto text-slate-400 group-hover:text-white transition-colors" />
              </a>
            </CardGlass>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white text-center">What the Ecosystem Says</h2>
        
        <CardGlass gradient className="max-w-4xl mx-auto">
          <div className="text-center space-y-6">
            <Quote className="w-12 h-12 mx-auto text-blue-400 opacity-50" />
            
            <blockquote className="text-lg md:text-xl text-slate-200 italic leading-relaxed">
              "{TESTIMONIALS[activeTestimonial].quote}"
            </blockquote>

            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {TESTIMONIALS[activeTestimonial].avatar}
                </span>
              </div>
              
              <div className="text-left">
                <div className="font-semibold text-white">
                  {TESTIMONIALS[activeTestimonial].name}
                </div>
                <div className="text-sm text-slate-400">
                  {TESTIMONIALS[activeTestimonial].role}
                </div>
                <div className="flex items-center mt-1">
                  {[...Array(TESTIMONIALS[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>

            {/* Testimonial Indicators */}
            <div className="flex justify-center space-x-2">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === activeTestimonial ? 'bg-blue-400' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardGlass>
      </section>

      {/* Call to Action */}
      <CardGlass gradient className="text-center">
        <h3 className="text-xl font-semibold text-white mb-4">
          Join Our Growing Ecosystem
        </h3>
        <p className="text-slate-300 mb-6">
          Interested in partnering with GuardianChain? Let's build the future of truth preservation together.
        </p>
        <a
          href="mailto:partnerships@guardianchain.com"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          Get in Touch
          <ExternalLink className="w-4 h-4 ml-2" />
        </a>
      </CardGlass>
    </div>
  );
}