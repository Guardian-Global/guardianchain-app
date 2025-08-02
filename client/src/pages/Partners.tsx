import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const PARTNERS = [
  {
    name: "Polygon",
    logo: "/assets/partners/polygon.svg",
    link: "https://polygon.technology",
    description: "Layer 2 scaling solution for Ethereum",
  },
  {
    name: "Gitcoin",
    logo: "/assets/partners/gitcoin.svg",
    link: "https://gitcoin.co",
    description: "Community funding for public goods",
  },
  {
    name: "OpenAI",
    logo: "/assets/partners/openai.svg",
    link: "https://openai.com",
    description: "AI-powered content analysis and verification",
  },
  {
    name: "Arweave",
    logo: "/assets/partners/arweave.svg",
    link: "https://www.arweave.org/",
    description: "Permanent decentralized storage",
  },
];

const TESTIMONIALS = [
  {
    name: "Gitcoin Reviewer",
    quote:
      "GuardianChain stands out as a truth-preserving protocol with unmatched long-term utility. The grant was well-deserved.",
    role: "Ecosystem Grants Committee",
    avatar: "🏛️",
  },
  {
    name: "Polygon Village",
    quote:
      "A next-gen use case for decentralized memory that fits directly into the sovereign stack.",
    role: "Partner Ecosystem Manager",
    avatar: "💜",
  },
  {
    name: "Truth Validator Network",
    quote:
      "GuardianChain represents the future of verifiable storytelling and permanent memory preservation.",
    role: "Validator Consortium Lead",
    avatar: "🛡️",
  },
  {
    name: "Web3 Foundation",
    quote:
      "Revolutionary approach to combining AI verification with blockchain permanence for social good.",
    role: "Grants Evaluation Team",
    avatar: "🌐",
  },
];

export default function PartnersPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 8000); // 8-second auto-rotation

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-950 dark:via-slate-900 dark:to-blue-950">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-600 dark:text-purple-400 mb-4">
            🤝 Our Partners & Ecosystem
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Building the future of decentralized memory preservation with
            leading Web3 organizations, AI pioneers, and blockchain
            infrastructure partners.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="mb-20">
          <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800 dark:text-gray-200">
            🌟 Technology Partners
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PARTNERS.map((partner) => (
              <Card
                key={partner.name}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700"
              >
                <CardContent className="p-6 text-center">
                  <a
                    href={partner.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {/* Placeholder for partner logo */}
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {partner.name.charAt(0)}
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">
                      {partner.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {partner.description}
                    </p>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800 dark:text-gray-200">
            🗣️ What the Ecosystem Says
          </h2>
          <Card className="max-w-4xl mx-auto bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-lg">
            <CardContent className="p-8">
              <div className="transition-all duration-500 ease-in-out">
                <div className="flex items-center justify-center mb-6">
                  <div className="text-4xl mb-4">
                    {TESTIMONIALS[activeTestimonial].avatar}
                  </div>
                </div>
                <blockquote className="text-xl italic text-center text-gray-700 dark:text-gray-300 mb-6">
                  "{TESTIMONIALS[activeTestimonial].quote}"
                </blockquote>
                <div className="text-center">
                  <div className="font-semibold text-lg text-purple-600 dark:text-purple-400">
                    {TESTIMONIALS[activeTestimonial].name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {TESTIMONIALS[activeTestimonial].role}
                  </div>
                </div>
              </div>

              {/* Testimonial Navigation Dots */}
              <div className="flex justify-center mt-8 space-x-2">
                {TESTIMONIALS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeTestimonial
                        ? "bg-purple-600 dark:bg-purple-400"
                        : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ecosystem Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                50+
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Validator Partners
              </div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                $2.5M+
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Grant Funding Secured
              </div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                15+
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Ecosystem Integrations
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Join the GuardianChain Ecosystem
              </h3>
              <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
                Partner with us to build the future of decentralized memory
                preservation and truth verification infrastructure.
              </p>
              <div className="space-x-4">
                <a
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300"
                >
                  Partner With Us
                </a>
                <a
                  href="/whitepaper"
                  className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-purple-600 transition-colors duration-300"
                >
                  Read Whitepaper
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
