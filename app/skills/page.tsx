"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Search, Filter, Grid3X3, List, Star, Users,
  Package, Puzzle, Shield, Code, FileText, Database,
  Globe, Bot, ChevronDown, X, Sparkles, Download,
  TrendingUp, Clock, Plus, ShoppingCart, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Skill data - in production from API
const skills = [
  {
    id: "web-search",
    name: "Web Search Pro",
    description: "Advanced web search with source validation, citation generation, and multi-engine support.",
    creator: "PowerCore",
    verified: true,
    price: 0,
    priceType: "free",
    installs: 12453,
    rating: 4.9,
    reviews: 342,
    category: "Research",
    icon: Globe,
    gradient: "from-blue-500 to-cyan-500",
    tags: ["search", "research", "citations"],
    featured: true,
    trending: true,
    compatibleAgents: ["research", "writer", "general"],
  },
  {
    id: "docx-creator",
    name: "Document Creator",
    description: "Create, edit, and analyze Word documents with tracked changes, comments, and formatting.",
    creator: "PowerCore",
    verified: true,
    price: 19,
    priceType: "one-time",
    installs: 8234,
    rating: 4.8,
    reviews: 189,
    category: "Documents",
    icon: FileText,
    gradient: "from-violet-500 to-purple-500",
    tags: ["docx", "word", "documents"],
    featured: true,
    trending: false,
    compatibleAgents: ["writer", "general"],
  },
  {
    id: "code-execution",
    name: "Code Sandbox",
    description: "Execute Python, JavaScript, and bash in a secure sandbox. Perfect for data analysis and automation.",
    creator: "DevTools",
    verified: true,
    price: 29,
    priceType: "one-time",
    installs: 6721,
    rating: 4.9,
    reviews: 156,
    category: "Development",
    icon: Code,
    gradient: "from-emerald-500 to-teal-500",
    tags: ["code", "python", "execution"],
    featured: true,
    trending: true,
    compatibleAgents: ["coder", "data", "general"],
  },
  {
    id: "pdf-toolkit",
    name: "PDF Toolkit",
    description: "Extract text, fill forms, merge/split PDFs, and generate new documents.",
    creator: "PowerCore",
    verified: true,
    price: 24,
    priceType: "one-time",
    installs: 5432,
    rating: 4.7,
    reviews: 98,
    category: "Documents",
    icon: FileText,
    gradient: "from-red-500 to-rose-500",
    tags: ["pdf", "forms", "documents"],
    featured: false,
    trending: false,
    compatibleAgents: ["writer", "general"],
  },
  {
    id: "database-connector",
    name: "Database Connector",
    description: "Connect to PostgreSQL, MySQL, MongoDB. Run queries and analyze data.",
    creator: "DataOps",
    verified: true,
    price: 39,
    priceType: "one-time",
    installs: 3210,
    rating: 4.8,
    reviews: 67,
    category: "Data",
    icon: Database,
    gradient: "from-amber-500 to-orange-500",
    tags: ["database", "sql", "analytics"],
    featured: false,
    trending: true,
    compatibleAgents: ["data", "coder"],
  },
  {
    id: "api-integrations",
    name: "API Gateway",
    description: "Make authenticated API calls to any service. OAuth, API keys, and webhooks supported.",
    creator: "IntegrateAI",
    verified: false,
    price: 19,
    priceType: "one-time",
    installs: 4521,
    rating: 4.6,
    reviews: 112,
    category: "Integration",
    icon: Puzzle,
    gradient: "from-pink-500 to-rose-500",
    tags: ["api", "webhooks", "integration"],
    featured: false,
    trending: false,
    compatibleAgents: ["general", "automation"],
  },
  {
    id: "memory-engine",
    name: "Long-Term Memory",
    description: "Persistent memory across sessions. Remember user preferences, past conversations, and context.",
    creator: "PowerCore",
    verified: true,
    price: 49,
    priceType: "one-time",
    installs: 7832,
    rating: 4.9,
    reviews: 234,
    category: "Intelligence",
    icon: Bot,
    gradient: "from-indigo-500 to-violet-500",
    tags: ["memory", "context", "rag"],
    featured: true,
    trending: true,
    compatibleAgents: ["all"],
  },
  {
    id: "spreadsheet-pro",
    name: "Spreadsheet Pro",
    description: "Create and manipulate Excel files. Formulas, charts, data analysis, and more.",
    creator: "PowerCore",
    verified: true,
    price: 24,
    priceType: "one-time",
    installs: 4123,
    rating: 4.7,
    reviews: 87,
    category: "Documents",
    icon: FileText,
    gradient: "from-green-500 to-emerald-500",
    tags: ["excel", "spreadsheet", "data"],
    featured: false,
    trending: false,
    compatibleAgents: ["data", "general"],
  },
];

// Skill packs (bundles)
const skillPacks = [
  {
    id: "office-suite",
    name: "Office Suite",
    description: "Complete document creation: Word, Excel, PDF, PowerPoint",
    skills: ["docx-creator", "spreadsheet-pro", "pdf-toolkit"],
    price: 49,
    savings: 18,
    gradient: "from-blue-600 to-violet-600",
  },
  {
    id: "developer-kit",
    name: "Developer Kit",
    description: "Everything for code-focused agents",
    skills: ["code-execution", "database-connector", "api-integrations"],
    price: 69,
    savings: 18,
    gradient: "from-emerald-600 to-cyan-600",
  },
  {
    id: "research-bundle",
    name: "Research Bundle",
    description: "Deep research with memory and citations",
    skills: ["web-search", "memory-engine", "pdf-toolkit"],
    price: 59,
    savings: 14,
    gradient: "from-amber-600 to-red-600",
  },
];

const categories = ["All", "Research", "Documents", "Development", "Data", "Integration", "Intelligence"];

export default function SkillsArmoryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<string[]>([]);
  const [ownedSkills, setOwnedSkills] = useState<string[]>(["web-search"]); // Free skill owned

  const filteredSkills = useMemo(() => {
    let result = [...skills];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (skill) =>
          skill.name.toLowerCase().includes(query) ||
          skill.description.toLowerCase().includes(query) ||
          skill.tags.some((tag) => tag.includes(query))
      );
    }
    if (selectedCategory !== "All") {
      result = result.filter((skill) => skill.category === selectedCategory);
    }
    return result;
  }, [searchQuery, selectedCategory]);

  const addToCart = (skillId: string) => {
    if (!cart.includes(skillId) && !ownedSkills.includes(skillId)) {
      setCart([...cart, skillId]);
    }
  };

  const removeFromCart = (skillId: string) => {
    setCart(cart.filter((id) => id !== skillId));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, skillId) => {
      const skill = skills.find((s) => s.id === skillId);
      return total + (skill?.price || 0);
    }, 0);
  }, [cart]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/10 via-transparent to-cyan-950/10" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/5 backdrop-blur-xl bg-black/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">PowerCore</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/marketplace" className="text-sm text-gray-400 hover:text-white transition-colors">
              Agents
            </Link>
            <Link href="/skills" className="text-sm text-white font-medium">
              Skills
            </Link>
            <Link href="/workshop" className="text-sm text-gray-400 hover:text-white transition-colors">
              Workshop
            </Link>
            <Link href="/hangar" className="text-sm text-gray-400 hover:text-white transition-colors">
              My Hangar
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Cart */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-violet-500 rounded-full text-xs flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 bg-[#1a1a24] border-white/10 p-4">
                <h3 className="font-semibold mb-3">Cart ({cart.length} items)</h3>
                {cart.length === 0 ? (
                  <p className="text-gray-400 text-sm">Your cart is empty</p>
                ) : (
                  <>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {cart.map((skillId) => {
                        const skill = skills.find((s) => s.id === skillId);
                        if (!skill) return null;
                        return (
                          <div key={skillId} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                            <div className="flex items-center gap-2">
                              <skill.icon className="w-4 h-4 text-violet-400" />
                              <span className="text-sm">{skill.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">${skill.price}</span>
                              <button onClick={() => removeFromCart(skillId)} className="text-gray-400 hover:text-white">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="border-t border-white/10 mt-3 pt-3">
                      <div className="flex justify-between mb-3">
                        <span className="text-gray-400">Total</span>
                        <span className="font-bold">${cartTotal}</span>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-violet-600 to-cyan-600">
                        Checkout
                      </Button>
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white border-0">
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Puzzle className="w-8 h-8 text-violet-400" />
            <h1 className="text-4xl font-bold">Skills Armory</h1>
          </div>
          <p className="text-gray-400">Equip your agents with powerful capabilities</p>
        </div>

        {/* Skill Packs (Bundles) */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-semibold">Skill Packs</h2>
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Save up to 30%</Badge>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {skillPacks.map((pack) => (
              <motion.div
                key={pack.id}
                whileHover={{ scale: 1.02 }}
                className="relative group cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${pack.gradient} opacity-20 group-hover:opacity-30 transition-opacity rounded-2xl blur-xl`} />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pack.gradient} flex items-center justify-center`}>
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      Save ${pack.savings}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{pack.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{pack.description}</p>
                  <div className="flex items-center gap-2 mb-4">
                    {pack.skills.map((skillId) => {
                      const skill = skills.find((s) => s.id === skillId);
                      if (!skill) return null;
                      return (
                        <div key={skillId} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center" title={skill.name}>
                          <skill.icon className="w-4 h-4 text-gray-300" />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">${pack.price}</div>
                    <Button size="sm" className="bg-white text-black hover:bg-gray-100">
                      Get Pack
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-12 px-4 bg-white/5 border-white/10 hover:bg-white/10 rounded-xl">
                <Filter className="w-4 h-4 mr-2" />
                {selectedCategory}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1a1a24] border-white/10">
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white/10 text-white" : "text-gray-500"}`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-white/10 text-white" : "text-gray-500"}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-400">{filteredSkills.length} skills available</p>
        </div>

        {/* Skills Grid */}
        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filteredSkills.map((skill, index) => {
                const isOwned = ownedSkills.includes(skill.id);
                const inCart = cart.includes(skill.id);

                return (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all h-full flex flex-col">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${skill.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <skill.icon className="w-6 h-6 text-white" />
                      </div>

                      {/* Badges */}
                      <div className="flex gap-1 mb-3 flex-wrap">
                        {skill.trending && (
                          <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-xs">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                        {skill.verified && (
                          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>

                      {/* Content */}
                      <h3 className="font-semibold mb-1 group-hover:text-violet-400 transition-colors">
                        {skill.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-1">by {skill.creator}</p>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-grow">
                        {skill.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-1 text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-sm">{skill.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Download className="w-3.5 h-3.5" />
                          <span className="text-sm">{skill.installs.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="font-bold">
                          {skill.price === 0 ? (
                            <span className="text-emerald-400">Free</span>
                          ) : (
                            <span>${skill.price}</span>
                          )}
                        </div>
                        {isOwned ? (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                            <Check className="w-3 h-3 mr-1" />
                            Owned
                          </Badge>
                        ) : inCart ? (
                          <Button size="sm" variant="outline" onClick={() => removeFromCart(skill.id)} className="border-white/20">
                            In Cart
                          </Button>
                        ) : (
                          <Button size="sm" onClick={() => addToCart(skill.id)} className="bg-violet-500 hover:bg-violet-600">
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {filteredSkills.map((skill, index) => {
                const isOwned = ownedSkills.includes(skill.id);
                const inCart = cart.includes(skill.id);

                return (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ x: 4 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${skill.gradient} flex items-center justify-center flex-shrink-0`}>
                        <skill.icon className="w-7 h-7 text-white" />
                      </div>

                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold group-hover:text-violet-400 transition-colors">
                            {skill.name}
                          </h3>
                          {skill.verified && <Shield className="w-4 h-4 text-cyan-400" />}
                        </div>
                        <p className="text-sm text-gray-500 mb-1">by {skill.creator} • {skill.category}</p>
                        <p className="text-sm text-gray-400 truncate">{skill.description}</p>
                      </div>

                      <div className="flex items-center gap-6 flex-shrink-0">
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-amber-400">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-medium">{skill.rating}</span>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-gray-300">
                            <Download className="w-4 h-4" />
                            <span>{skill.installs.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="text-right min-w-[100px]">
                          <div className="text-xl font-bold mb-1">
                            {skill.price === 0 ? <span className="text-emerald-400">Free</span> : `$${skill.price}`}
                          </div>
                          {isOwned ? (
                            <Badge className="bg-emerald-500/20 text-emerald-400">Owned</Badge>
                          ) : inCart ? (
                            <Button size="sm" variant="outline" onClick={() => removeFromCart(skill.id)}>
                              Remove
                            </Button>
                          ) : (
                            <Button size="sm" onClick={() => addToCart(skill.id)} className="bg-violet-500 hover:bg-violet-600">
                              Add to Cart
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
