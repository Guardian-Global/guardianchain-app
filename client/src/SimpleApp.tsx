import { Switch, Route, Link } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { useEffect, useRef, useState } from "react";
import CapsuleStats from "./pages/CapsuleStats";
import Timeline from "./pages/Timeline";
import ValidatorBids from "./pages/ValidatorBids";
import SearchResults from "./pages/SearchResults";
import NewCapsule from "./pages/NewCapsule";
import CapsuleDetail from "./pages/CapsuleDetail";

// Create minimal UI components to avoid dependency issues
function Button({ children, size, variant, className, type, ...props }: any) {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors";
  const sizeClasses = size === "lg" ? "px-6 py-3 text-lg" : "";
  const variantClasses = variant === "outline" 
    ? "border border-white text-white hover:bg-white hover:text-black" 
    : "bg-white text-black hover:bg-gray-100";
  
  return (
    <button 
      type={type}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Input({ placeholder, value, onChange, className, type = "text", name, ...props }: any) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ""}`}
      {...props}
    />
  );
}

const translations = {
  en: {
    title: "GuardianChain",
    subtitle: "The world's first sovereign memory infrastructure. Own your truth. Seal your story. Yield from your lived experiences.",
    explore: "Explore Capsules",
    launch: "Launch App",
    subscribe: "Subscribe",
    search_placeholder: "Search by title, tags, author...",
    search: "Search",
    cta_title: "Ready to Take Ownership of Your Truth?",
    cta_sub: "Join thousands of users minting, sealing, and sharing their sovereign truth capsules. Your legacy is your power.",
    start: "Get Started",
    whitepaper: "View Whitepaper",
    search_title: "Search Truth Capsules",
  },
  es: {
    title: "GuardianChain",
    subtitle: "La primera infraestructura de memoria soberana del mundo. Posee tu verdad. Sella tu historia. Gana con tus experiencias vividas.",
    explore: "Explorar Cápsulas",
    launch: "Lanzar App",
    subscribe: "Suscribirse",
    search_placeholder: "Buscar por título, etiquetas, autor...",
    search: "Buscar",
    cta_title: "¿Listo para ser dueño de tu verdad?",
    cta_sub: "Únete a miles de usuarios que están sellando y compartiendo cápsulas de verdad soberana. Tu legado es tu poder.",
    start: "Comenzar",
    whitepaper: "Ver Documento",
    search_title: "Buscar Cápsulas de Verdad",
  },
  ar: {
    title: "غارديان تشين",
    subtitle: "أول بنية تحتية للذاكرة السيادية في العالم. امتلك حقيقتك. احفظ قصتك. اربح من تجاربك المعيشية.",
    explore: "استكشاف الكبسولات",
    launch: "تشغيل التطبيق",
    subscribe: "اشترك",
    search_placeholder: "ابحث بالعنوان أو العلامات أو المؤلف...",
    search: "ابحث",
    cta_title: "هل أنت مستعد لامتلاك حقيقتك؟",
    cta_sub: "انضم إلى الآلاف من المستخدمين الذين يقومون بسك وتوثيق كبسولات الحقيقة. إرثك هو قوتك.",
    start: "ابدأ الآن",
    whitepaper: "عرض المستند",
    search_title: "ابحث عن كبسولات الحقيقة",
  },
  zh: {
    title: "守护链",
    subtitle: "世界上第一个主权记忆基础设施。拥有你的真相。封存你的故事。从经历中获益。",
    explore: "探索胶囊",
    launch: "启动应用",
    subscribe: "订阅",
    search_placeholder: "按标题、标签、作者搜索...",
    search: "搜索",
    cta_title: "准备好掌控你的真相了吗？",
    cta_sub: "加入数千用户，共同铸造和分享主权真相胶囊。你的遗产就是你的力量。",
    start: "立即开始",
    whitepaper: "查看白皮书",
    search_title: "搜索真相胶囊",
  },
};

// Enhanced homepage component with multilingual support
function HomePage() {
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [email, setEmail] = useState("");
  const [lang, setLang] = useState("en");
  const t = translations[lang as keyof typeof translations];

  useEffect(() => {
    if (heroVideoRef.current) {
      heroVideoRef.current.play().catch(() => {
        // Video autoplay failed, which is expected in some browsers
      });
    }
  }, []);

  const handleSubscribe = async () => {
    if (!email) return;
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setEmail("");
      alert("Successfully subscribed!");
    } catch (error) {
      console.error("Subscription failed:", error);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Language Switch */}
      <div className="absolute top-4 right-4 z-20">
        <select
          className="bg-slate-800 text-white px-4 py-2 rounded"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
        >
          <option value="en">🇺🇸 English</option>
          <option value="es">🇪🇸 Español</option>
          <option value="ar">🇸🇦 عربي</option>
          <option value="zh">🇨🇳 中文</option>
        </select>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 to-indigo-600 py-20 px-6 text-center overflow-hidden">
        <video
          ref={heroVideoRef}
          src="https://mpjgcleldijxkvbuxiqg.supabase.co/storage/v1/object/public/media-assets//GUARDIANCHAIN_PROTOCOL_VIDEO_MAIN.mp4"
          className="w-full max-h-[80vh] object-cover rounded-2xl shadow-xl border border-indigo-700"
          autoPlay
          muted
          loop
        />
        <div className="absolute inset-0 bg-black/40 rounded-2xl" />
        <div className="absolute inset-0 flex flex-col justify-center items-center z-10 px-6">
          <img
            src="/assets/GUARDIANCHAIN_logo.png"
            alt="GuardianChain Logo"
            className="w-40 h-auto mb-4"
          />
          <h1 className="text-5xl md:text-7xl font-extrabold drop-shadow-xl tracking-tight">
            {t.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-200">
            {t.subtitle}
          </p>
          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <Button size="lg">{t.explore}</Button>
            <Button size="lg" variant="outline">{t.launch}</Button>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubscribe();
              }}
              className="flex items-center gap-2 mt-4 md:mt-0"
            >
              <Input
                placeholder="Enter email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                className="bg-white text-black"
              />
              <Button type="submit" className="bg-indigo-500 text-white">
                {t.subscribe}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="bg-slate-800 py-12 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">{t.search_title}</h2>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const searchQuery = formData.get('q') as string;
            if (searchQuery) {
              window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
            }
          }}
          className="flex justify-center gap-2 max-w-lg mx-auto"
        >
          <Input
            type="text"
            name="q"
            placeholder={t.search_placeholder}
            className="w-full bg-white text-black"
            required
          />
          <Button type="submit" className="bg-indigo-600">{t.search}</Button>
        </form>
      </section>

      {/* About GTT */}
      <section className="grid md:grid-cols-2 gap-12 p-10">
        <div>
          <video
            src="/assets/video/GTT_logo_video.mp4"
            className="w-full rounded-xl shadow-lg"
            controls
          />
          <h2 className="text-3xl font-bold mt-6">Guardian Truth Token (GTT)</h2>
          <p className="text-slate-300 mt-3">
            GTT is more than a token — it's a reward for verified memory. Users mint capsules, contribute to truth audits, and earn GTT for their participation in the sovereign memory economy.
          </p>
        </div>

        <div>
          <video
            src="/assets/video/GUARDIANCHAIN_logo_video.mp4"
            className="w-full rounded-xl shadow-lg"
            controls
          />
          <h2 className="text-3xl font-bold mt-6">What is GuardianChain?</h2>
          <p className="text-slate-300 mt-3">
            GuardianChain is a memory blockchain that verifies human-authored truth capsules, locks authorship through cryptographic proofs, and monetizes emotional legacy via yield generation.
          </p>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-slate-800 py-16 px-8">
        <h2 className="text-4xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-slate-700 rounded-lg p-6 shadow-xl">
            <h3 className="text-2xl font-semibold mb-2">🧠 Capture</h3>
            <p className="text-slate-300">Upload moments, media, and messages into secure capsules — with optional griefScore or truth tags.</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-6 shadow-xl">
            <h3 className="text-2xl font-semibold mb-2">🔐 Seal & Mint</h3>
            <p className="text-slate-300">Mint your capsule on-chain, seal it with a Veritas Certificate, and lock your authorship forever.</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-6 shadow-xl">
            <h3 className="text-2xl font-semibold mb-2">💸 Unlock & Earn</h3>
            <p className="text-slate-300">Receive GTT yield when others verify, unlock, or vote on your capsule. The truth has value — literally.</p>
          </div>
        </div>
      </section>

      {/* Engagement CTA */}
      <section className="bg-indigo-700 py-20 px-8 text-center text-white">
        <h2 className="text-4xl font-bold">{t.cta_title}</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg">
          {t.cta_sub}
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button size="lg" className="bg-white text-indigo-700 hover:bg-slate-100">{t.start}</Button>
          <Button size="lg" variant="outline">{t.whitepaper}</Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-10 text-center text-slate-400">
        <p>© {new Date().getFullYear()} GuardianChain. All rights reserved.</p>
      </footer>
    </main>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-gray-600">Page not found</p>
      </div>
    </div>
  );
}

// Simple navigation component
function Navigation() {
  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/">
          <span className="text-xl font-bold text-white cursor-pointer">GuardianChain</span>
        </Link>
        <div className="flex space-x-6">
          <Link href="/capsule-stats">
            <span className="text-slate-300 hover:text-white cursor-pointer transition-colors">Capsule Stats</span>
          </Link>
          <Link href="/timeline">
            <span className="text-slate-300 hover:text-white cursor-pointer transition-colors">Timeline</span>
          </Link>
          <Link href="/validator-bids">
            <span className="text-slate-300 hover:text-white cursor-pointer transition-colors">Validator Bids</span>
          </Link>
          <Link href="/search">
            <span className="text-slate-300 hover:text-white cursor-pointer transition-colors">Search</span>
          </Link>
          <Link href="/capsules/new">
            <span className="text-slate-300 hover:text-white cursor-pointer transition-colors">Create Capsule</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/capsule-stats">
          <Navigation />
          <CapsuleStats />
        </Route>
        <Route path="/timeline">
          <Navigation />
          <Timeline />
        </Route>
        <Route path="/validator-bids">
          <Navigation />
          <ValidatorBids />
        </Route>
        <Route path="/search">
          <Navigation />
          <SearchResults />
        </Route>
        <Route path="/capsules/new">
          <Navigation />
          <NewCapsule />
        </Route>
        <Route path="/capsule/:id">
          <Navigation />
          <CapsuleDetail />
        </Route>
        <Route>
          <Navigation />
          <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
              <Link href="/">
                <Button>Return Home</Button>
              </Link>
            </div>
          </div>
        </Route>
      </Switch>
    </QueryClientProvider>
  );
}