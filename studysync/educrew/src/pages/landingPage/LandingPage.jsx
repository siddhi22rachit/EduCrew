import React, { useState, useEffect } from 'react';
import { ArrowRight, Users, BookOpen, Calendar, MessageCircle, PlusCircle, Brain, Target, Zap, Activity } from 'lucide-react';

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { count: '10K+', label: 'Active Students' },
    { count: '500+', label: 'Study Rooms' },
    { count: '50K+', label: 'Study Hours' },
    { count: '95%', label: 'Success Rate' },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-lg py-4' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
            StudySync
          </div>
          <div className="flex gap-8">
            <button className="text-gray-300 hover:text-white transition-colors">Features</button>
            <button className="text-gray-300 hover:text-white transition-colors">Rooms</button>
            <button className="bg-fuchsia-500 hover:bg-fuchsia-600 px-4 py-2 rounded-lg transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Particle Effect */}
      <div className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                backgroundColor: i % 2 ? '#ff00ff' : '#00ffff',
                opacity: 0.3,
                animation: `pulse ${Math.random() * 3 + 2}s infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className={`text-center transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
                Revolutionize
              </span>
              <br />
              Your Study Game
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join the next generation of collaborative learning where knowledge meets innovation
            </p>
            <div className="flex justify-center gap-6">
              <button className="group bg-gradient-to-r from-fuchsia-500 to-cyan-400 p-[2px] rounded-lg">
                <div className="bg-black px-8 py-3 rounded-lg flex items-center gap-2 group-hover:bg-transparent transition-colors">
                  Start Learning <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
              <button className="px-8 py-3 rounded-lg border border-gray-700 hover:border-fuchsia-500 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-900/50 backdrop-blur-xl p-6 rounded-xl border border-gray-800 hover:border-fuchsia-500 transition-colors"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
                {feature.count}
              </div>
              <div className="text-gray-400">{feature.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Feature Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Brain, title: "AI-Powered Study Plans", desc: "Personalized learning paths" },
            { icon: Target, title: "Focus Sessions", desc: "Distraction-free studying" },
            { icon: Zap, title: "Instant Collaboration", desc: "Real-time study groups" },
            { icon: Activity, title: "Progress Tracking", desc: "Detailed analytics" }
          ].map((card, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-r from-fuchsia-500/10 to-cyan-400/10 p-[1px] rounded-xl overflow-hidden"
              onMouseEnter={() => setActiveFeature(index)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
              <div className="relative bg-gray-900 p-6 rounded-xl h-full">
                <card.icon className={`w-12 h-12 mb-4 transition-colors ${
                  activeFeature === index ? 'text-fuchsia-500' : 'text-gray-400'
                }`} />
                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-gray-400">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Study Room Preview */}
      <div className="bg-gradient-to-b from-transparent to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-cyan-400 rounded-xl blur-3xl opacity-10 animate-pulse"></div>
            <div className="relative bg-gray-900 rounded-xl p-8 border border-gray-800">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Experience Live Study Rooms</h2>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-fuchsia-500" />
                      <span>Join active study sessions instantly</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-6 h-6 text-cyan-400" />
                      <span>Real-time chat and collaboration</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-6 h-6 text-fuchsia-500" />
                      <span>Share notes and resources</span>
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-fuchsia-500 to-cyan-400 hover:from-fuchsia-600 hover:to-cyan-500 text-black font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105">
                    Join a Room Now
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-cyan-400 rounded-lg blur-xl opacity-20"></div>
                  <div className="relative bg-black/50 backdrop-blur-xl p-6 rounded-lg border border-gray-800">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-semibold">Advanced Physics • Live</span>
                      </div>
                      <span className="text-sm text-gray-400">24 participants</span>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-gray-800/50 p-4 rounded-lg">
                        <p className="text-sm">Currently discussing: Quantum Mechanics</p>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-lg">
                        <p className="text-sm">Next topic: String Theory (in 15 mins)</p>
                      </div>
                      <div className="flex -space-x-2">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 border-2 border-black"
                          />
                        ))}
                        <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-black flex items-center justify-center text-xs">
                          +19
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;