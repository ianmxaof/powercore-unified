"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, Bot, Sparkles, ArrowRight, Play, Star, 
  Users, TrendingUp, Shield, Code, Layers, ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Featured agents for the landing page showcase
const featuredAgents = [
  { 
    id: 1, 
    name: "Research Pro", 
    creator: "PowerCore", 
    price: 29, 
    installs: 2847, 
    rating: 4.9,
    category: "Research",
    gradient: "from-violet-500 to-purple-600"
  },
  { 
    id: 2, 
    name: "Code Reviewer", 
    creator: "DevTools", 
    price: 19, 
    installs: 1923, 
    rating: 4.8,
    category: "Development",
    gradient: "from-cyan-500 to-blue-600"
  },
  { 
    id: 3, 
    name: "Content Writer", 
    creator: "CreativeAI", 
    price: 39, 
    installs: 3421, 
    rating: 4.9,
    category: "Writing",
    gradient: "from-amber-500 to-orange-600"
  },
];

const stats = [
  { label: "Active Agents", value: "2,400+", icon: Bot },
  { label: "Creators", value: "850+", icon: Users },
  { label: "Monthly Users", value: "45K+", icon: TrendingUp },
];

export default function LandingPage() {
  const [activeAgent, setActiveAgent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAgent((prev) => (prev + 1) % featuredAgents.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/20 via-transparent to-cyan-950/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/5 backdrop-blur-xl bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">PowerCore</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/marketplace" className="text-sm text-gray-400 hover:text-white transition-colors">
              Marketplace
            </Link>
            <Link href="/workshop" className="text-sm text-gray-400 hover:text-white transition-colors">
              Workshop
            </Link>
            <Link href="/governance" className="text-sm text-gray-400 hover:text-white transition-colors">
              Governance
            </Link>
            <Link href="/leaderboard" className="text-sm text-gray-400 hover:text-white transition-colors">
              Leaderboard
            </Link>
            <Link href="/docs" className="text-sm text-gray-400 hover:text-white transition-colors">
              Docs
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              Sign In
            </Button>
            <Button className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white border-0">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-6 bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/20">
                <Sparkles className="w-3 h-3 mr-1" />
                The AI Agent Marketplace
              </Badge>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
                Build. Deploy.{" "}
                <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  Monetize.
                </span>
              </h1>
              
              <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-lg">
                The marketplace for AI agents. Discover powerful automations, 
                create your own with no code, and earn from your creations.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-gray-100 text-lg px-8 h-14 rounded-xl"
                >
                  Explore Agents
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10 text-lg px-8 h-14 rounded-xl"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-8">
                {stats.map((stat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <div className="text-xl font-bold">{stat.value}</div>
                      <div className="text-sm text-gray-500">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Agent Showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-cyan-600/20 rounded-3xl blur-2xl" />
                
                {/* Main card */}
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
                  {/* Agent roster grid (3x3 style you mentioned) */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[...Array(9)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`aspect-square rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                          i === activeAgent 
                            ? 'bg-gradient-to-br from-violet-500 to-cyan-500 scale-105 shadow-lg shadow-violet-500/25' 
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                        whileHover={{ scale: i === activeAgent ? 1.05 : 1.02 }}
                        onClick={() => setActiveAgent(i % 3)}
                      >
                        <Bot className={`w-8 h-8 ${i === activeAgent ? 'text-white' : 'text-gray-500'}`} />
                      </motion.div>
                    ))}
                  </div>

                  {/* Active agent details */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeAgent}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-2xl font-bold">{featuredAgents[activeAgent].name}</h3>
                          <p className="text-gray-400">by {featuredAgents[activeAgent].creator}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">${featuredAgents[activeAgent].price}</div>
                          <div className="flex items-center gap-1 text-amber-400">
                            <Star className="w-4 h-4 fill-current" />
                            <span>{featuredAgents[activeAgent].rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Users className="w-4 h-4" />
                          {featuredAgents[activeAgent].installs.toLocaleString()} installs
                        </div>
                        <Button size="sm" className="bg-white text-black hover:bg-gray-100">
                          View Agent
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything you need</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From discovery to deployment, PowerCore is the complete platform for AI agents
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Layers,
                title: "Agent Marketplace",
                description: "Discover thousands of pre-built agents for research, coding, writing, and more. One-click deploy to your workflow.",
                gradient: "from-violet-500 to-purple-600"
              },
              {
                icon: Code,
                title: "No-Code Workshop",
                description: "Build custom agents without writing code. Visual editor, templates, and live testing built right in.",
                gradient: "from-cyan-500 to-blue-600"
              },
              {
                icon: TrendingUp,
                title: "Creator Economy",
                description: "Monetize your agents. Set your prices, track sales, and build recurring revenue from your creations.",
                gradient: "from-amber-500 to-orange-600"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl"
                  style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
                />
                <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-colors h-full">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-cyan-600/20 to-violet-600/20 rounded-3xl blur-3xl" />
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-12">
              <h2 className="text-4xl font-bold mb-4">Ready to build the future?</h2>
              <p className="text-xl text-gray-400 mb-8 max-w-xl mx-auto">
                Join thousands of creators building and selling AI agents on PowerCore.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-black hover:bg-gray-100 text-lg px-8 h-14 rounded-xl">
                  Start Building Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 h-14 rounded-xl">
                  View Pricing
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">PowerCore</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/docs" className="hover:text-white transition-colors">Documentation</Link>
              <Link href="/support" className="hover:text-white transition-colors">Support</Link>
            </div>
            <div className="text-sm text-gray-500">
              © 2026 PowerCore. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
