"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Search, Filter, Grid3X3, List, Star, Users,
  Zap, TrendingUp, Clock, ChevronDown, X, Sparkles
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

// Sample agent data - in production, this comes from your API
const agents = [
  {
    id: "research-pro",
    name: "Research Pro",
    creator: "PowerCore",
    creatorVerified: true,
    description: "Deep research across 50+ sources with citation generation and report synthesis.",
    price: 29,
    priceType: "one-time",
    installs: 2847,
    rating: 4.9,
    reviews: 127,
    category: "Research",
    tags: ["research", "citations", "reports"],
    gradient: "from-violet-500 to-purple-600",
    featured: true,
    trending: true,
  },
  {
    id: "code-reviewer",
    name: "Code Reviewer",
    creator: "DevTools",
    creatorVerified: true,
    description: "Automated code review with security scanning and best practice suggestions.",
    price: 9,
    priceType: "monthly",
    installs: 1923,
    rating: 4.8,
    reviews: 89,
    category: "Development",
    tags: ["code", "review", "security"],
    gradient: "from-cyan-500 to-blue-600",
    featured: true,
    trending: false,
  },
  {
    id: "content-writer",
    name: "Content Writer",
    creator: "CreativeAI",
    creatorVerified: false,
    description: "Generate blog posts, articles, and marketing copy with SEO optimization.",
    price: 39,
    priceType: "one-time",
    installs: 3421,
    rating: 4.9,
    reviews: 203,
    category: "Writing",
    tags: ["writing", "content", "seo"],
    gradient: "from-amber-500 to-orange-600",
    featured: true,
    trending: true,
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    creator: "DataOps",
    creatorVerified: true,
    description: "Analyze datasets, generate visualizations, and extract insights automatically.",
    price: 49,
    priceType: "one-time",
    installs: 1247,
    rating: 4.7,
    reviews: 64,
    category: "Data",
    tags: ["data", "analytics", "visualization"],
    gradient: "from-emerald-500 to-teal-600",
    featured: false,
    trending: true,
  },
  {
    id: "email-assistant",
    name: "Email Assistant",
    creator: "ProductivityAI",
    creatorVerified: false,
    description: "Draft, respond, and manage emails with context-aware suggestions.",
    price: 0,
    priceType: "free",
    installs: 8234,
    rating: 4.6,
    reviews: 412,
    category: "Productivity",
    tags: ["email", "productivity", "communication"],
    gradient: "from-pink-500 to-rose-600",
    featured: false,
    trending: false,
  },
  {
    id: "meeting-summarizer",
    name: "Meeting Summarizer",
    creator: "WorkflowAI",
    creatorVerified: true,
    description: "Transcribe meetings, extract action items, and generate follow-up tasks.",
    price: 19,
    priceType: "monthly",
    installs: 2156,
    rating: 4.8,
    reviews: 156,
    category: "Productivity",
    tags: ["meetings", "transcription", "tasks"],
    gradient: "from-indigo-500 to-violet-600",
    featured: false,
    trending: false,
  },
  {
    id: "social-scheduler",
    name: "Social Scheduler",
    creator: "MarketingAI",
    creatorVerified: false,
    description: "Plan, create, and schedule social media content across platforms.",
    price: 29,
    priceType: "monthly",
    installs: 1876,
    rating: 4.5,
    reviews: 92,
    category: "Marketing",
    tags: ["social", "marketing", "scheduling"],
    gradient: "from-blue-500 to-cyan-600",
    featured: false,
    trending: false,
  },
  {
    id: "legal-assistant",
    name: "Legal Assistant",
    creator: "LegalTech",
    creatorVerified: true,
    description: "Review contracts, identify risks, and suggest clause improvements.",
    price: 99,
    priceType: "one-time",
    installs: 743,
    rating: 4.9,
    reviews: 38,
    category: "Legal",
    tags: ["legal", "contracts", "compliance"],
    gradient: "from-slate-500 to-gray-600",
    featured: false,
    trending: false,
  },
  {
    id: "customer-support",
    name: "Support Agent",
    creator: "ServiceAI",
    creatorVerified: true,
    description: "Handle customer inquiries, resolve issues, and escalate when needed.",
    price: 49,
    priceType: "monthly",
    installs: 1534,
    rating: 4.7,
    reviews: 87,
    category: "Support",
    tags: ["support", "customer", "service"],
    gradient: "from-green-500 to-emerald-600",
    featured: false,
    trending: false,
  },
];

const categories = [
  "All",
  "Research",
  "Development",
  "Writing",
  "Data",
  "Productivity",
  "Marketing",
  "Legal",
  "Support",
];

const sortOptions = [
  { label: "Most Popular", value: "popular" },
  { label: "Highest Rated", value: "rating" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

export default function MarketplacePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort agents
  const filteredAgents = useMemo(() => {
    let result = [...agents];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (agent) =>
          agent.name.toLowerCase().includes(query) ||
          agent.description.toLowerCase().includes(query) ||
          agent.tags.some((tag) => tag.includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter((agent) => agent.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case "popular":
        result.sort((a, b) => b.installs - a.installs);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        // In production, sort by created_at
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  const featuredAgents = agents.filter((a) => a.featured);
  const trendingAgents = agents.filter((a) => a.trending);

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
            <Link href="/marketplace" className="text-sm text-white font-medium">
              Marketplace
            </Link>
            <Link href="/workshop" className="text-sm text-gray-400 hover:text-white transition-colors">
              Workshop
            </Link>
            <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
              Dashboard
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

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Agent Marketplace</h1>
          <p className="text-gray-400">Discover powerful AI agents built by the community</p>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl focus:border-violet-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter */}
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
                  className={`text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer ${
                    selectedCategory === category ? "bg-white/10 text-white" : ""
                  }`}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-12 px-4 bg-white/5 border-white/10 hover:bg-white/10 rounded-xl">
                <TrendingUp className="w-4 h-4 mr-2" />
                {sortOptions.find((s) => s.value === sortBy)?.label}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1a1a24] border-white/10">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer ${
                    sortBy === option.value ? "bg-white/10 text-white" : ""
                  }`}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Toggle */}
          <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-white/10 text-white" : "text-gray-500 hover:text-white"
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list" ? "bg-white/10 text-white" : "text-gray-500 hover:text-white"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Featured Section (only show when no search/filter active) */}
        {!searchQuery && selectedCategory === "All" && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-semibold">Featured Agents</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {featuredAgents.map((agent) => (
                <Link key={agent.id} href={`/marketplace/${agent.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative group cursor-pointer"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${agent.gradient} opacity-20 group-hover:opacity-30 transition-opacity rounded-2xl blur-xl`} />
                    <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center`}>
                          <Bot className="w-7 h-7 text-white" />
                        </div>
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                          Featured
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold mb-1">{agent.name}</h3>
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{agent.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-amber-400">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-medium">{agent.rating}</span>
                          </div>
                          <span className="text-gray-500 text-sm">({agent.reviews})</span>
                        </div>
                        <div className="text-lg font-bold">
                          {agent.price === 0 ? "Free" : `$${agent.price}`}
                          {agent.priceType === "monthly" && <span className="text-sm text-gray-400">/mo</span>}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">
            {filteredAgents.length} agent{filteredAgents.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Agent Grid/List */}
        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filteredAgents.map((agent, index) => (
                <Link key={agent.id} href={`/marketplace/${agent.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="group cursor-pointer h-full"
                  >
                    <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all h-full flex flex-col">
                      {/* Agent Icon */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Bot className="w-6 h-6 text-white" />
                      </div>

                      {/* Tags */}
                      <div className="flex gap-1 mb-3 flex-wrap">
                        {agent.trending && (
                          <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-xs">
                            Trending
                          </Badge>
                        )}
                        <Badge variant="outline" className="border-white/10 text-gray-400 text-xs">
                          {agent.category}
                        </Badge>
                      </div>

                      {/* Content */}
                      <h3 className="font-semibold mb-1 group-hover:text-violet-400 transition-colors">
                        {agent.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-1">
                        by {agent.creator}
                        {agent.creatorVerified && (
                          <span className="inline-flex items-center ml-1 text-cyan-400">✓</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-grow">
                        {agent.description}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-amber-400">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="text-sm">{agent.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Users className="w-3.5 h-3.5" />
                            <span className="text-sm">{agent.installs.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="font-bold">
                          {agent.price === 0 ? (
                            <span className="text-emerald-400">Free</span>
                          ) : (
                            <>
                              ${agent.price}
                              {agent.priceType === "monthly" && (
                                <span className="text-xs text-gray-400 font-normal">/mo</span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {filteredAgents.map((agent, index) => (
                <Link key={agent.id} href={`/marketplace/${agent.id}`}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ x: 4 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all flex items-center gap-4">
                      {/* Agent Icon */}
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center flex-shrink-0`}>
                        <Bot className="w-7 h-7 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold group-hover:text-violet-400 transition-colors">
                            {agent.name}
                          </h3>
                          {agent.trending && (
                            <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-xs">
                              Trending
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-1">
                          by {agent.creator} • {agent.category}
                        </p>
                        <p className="text-sm text-gray-400 truncate">
                          {agent.description}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6 flex-shrink-0">
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-amber-400">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-medium">{agent.rating}</span>
                          </div>
                          <div className="text-xs text-gray-500">{agent.reviews} reviews</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-gray-300">
                            <Users className="w-4 h-4" />
                            <span className="font-medium">{agent.installs.toLocaleString()}</span>
                          </div>
                          <div className="text-xs text-gray-500">installs</div>
                        </div>
                        <div className="text-right min-w-[80px]">
                          <div className="text-xl font-bold">
                            {agent.price === 0 ? (
                              <span className="text-emerald-400">Free</span>
                            ) : (
                              <>
                                ${agent.price}
                                {agent.priceType === "monthly" && (
                                  <span className="text-sm text-gray-400 font-normal">/mo</span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredAgents.length === 0 && (
          <div className="text-center py-16">
            <Bot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No agents found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="border-white/20"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
