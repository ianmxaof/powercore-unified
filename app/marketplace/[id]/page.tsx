"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bot, Zap, ArrowLeft, Star, Users, Shield, Check,
  Play, MessageSquare, Code, FileText, Globe, ChevronRight,
  Heart, Share2, Flag, Clock, Download, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// This would come from your API in production
const getAgentById = (id: string) => ({
  id,
  name: "Research Pro",
  creator: "PowerCore",
  creatorVerified: true,
  creatorAvatar: null,
  description: "Deep research across 50+ sources with citation generation and comprehensive report synthesis. Perfect for academic research, market analysis, and due diligence.",
  longDescription: `Research Pro is the most advanced research agent on PowerCore. It combines powerful web search capabilities with intelligent source evaluation and citation generation.

**Key Features:**
- Search across 50+ academic and web sources
- Automatic citation generation (APA, MLA, Chicago)
- Source credibility scoring
- Export to PDF, Word, or Notion
- Save research sessions for later

**Use Cases:**
- Academic research papers
- Market analysis reports
- Competitive intelligence
- Due diligence investigations
- Literature reviews`,
  price: 29,
  priceType: "one-time" as const,
  installs: 2847,
  rating: 4.9,
  reviews: 127,
  category: "Research",
  tags: ["research", "citations", "reports", "academic", "analysis"],
  gradient: "from-violet-500 to-purple-600",
  capabilities: [
    { name: "Web Search", icon: Globe, description: "Search the internet for information" },
    { name: "File Analysis", icon: FileText, description: "Read and analyze uploaded documents" },
    { name: "Code Execution", icon: Code, description: "Run Python for data processing" },
  ],
  screenshots: [
    "/screenshots/research-1.png",
    "/screenshots/research-2.png",
    "/screenshots/research-3.png",
  ],
  reviews_data: [
    { user: "Alex M.", rating: 5, comment: "Saved me hours of research time. The citations are perfectly formatted.", date: "2 days ago" },
    { user: "Sarah K.", rating: 5, comment: "Best research tool I've used. The source quality is excellent.", date: "1 week ago" },
    { user: "James L.", rating: 4, comment: "Great agent, wish it had more export options.", date: "2 weeks ago" },
  ],
  changelog: [
    { version: "2.1.0", date: "Jan 15, 2026", changes: ["Added Chicago citation style", "Improved source credibility scoring"] },
    { version: "2.0.0", date: "Dec 28, 2025", changes: ["Major rewrite with better accuracy", "Added Notion export"] },
    { version: "1.5.0", date: "Nov 10, 2025", changes: ["Added MLA citation style", "Bug fixes"] },
  ],
  relatedAgents: [
    { id: "academic-writer", name: "Academic Writer", price: 39, rating: 4.8, installs: 1234 },
    { id: "data-analyst", name: "Data Analyst", price: 49, rating: 4.7, installs: 1567 },
  ],
});

export default function AgentDetailPage() {
  const params = useParams();
  const agentId = params.id as string;
  const agent = getAgentById(agentId);
  
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"one-time" | "subscription">("one-time");

  const handlePurchase = () => {
    // In production, this triggers Stripe checkout
    console.log("Purchasing agent:", agent.id, "Plan:", selectedPlan);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/10 via-transparent to-cyan-950/10" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/5 backdrop-blur-xl bg-black/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/marketplace" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight hidden sm:block">PowerCore</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={isWishlisted ? "text-rose-500" : "text-gray-400"}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white border-0">
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-500">{agent.category}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">{agent.name}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="flex items-start gap-6">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center flex-shrink-0`}>
                <Bot className="w-10 h-10 text-white" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{agent.name}</h1>
                  {agent.creatorVerified && (
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-gray-400 mb-3">by {agent.creator}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-amber-400 fill-current" />
                    <span className="font-semibold">{agent.rating}</span>
                    <span className="text-gray-500">({agent.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Download className="w-4 h-4" />
                    <span>{agent.installs.toLocaleString()} installs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-lg text-gray-300 leading-relaxed">{agent.description}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {agent.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="border-white/10 text-gray-400">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Capabilities */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Capabilities</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {agent.capabilities.map((cap) => (
                  <div key={cap.name} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <cap.icon className="w-6 h-6 text-violet-400 mb-2" />
                    <div className="font-medium mb-1">{cap.name}</div>
                    <div className="text-sm text-gray-400">{cap.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs for Details, Reviews, Changelog */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="bg-white/5 border border-white/10">
                <TabsTrigger value="details" className="data-[state=active]:bg-white/10">Details</TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:bg-white/10">Reviews</TabsTrigger>
                <TabsTrigger value="changelog" className="data-[state=active]:bg-white/10">Changelog</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-6">
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-line text-gray-300 leading-relaxed">
                    {agent.longDescription}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6 space-y-4">
                {agent.reviews_data.map((review, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-sm font-medium">
                          {review.user.charAt(0)}
                        </div>
                        <span className="font-medium">{review.user}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? "text-amber-400 fill-current" : "text-gray-600"}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                    <p className="text-gray-300">{review.comment}</p>
                  </div>
                ))}
                <Button variant="outline" className="w-full border-white/10 hover:bg-white/10">
                  Load More Reviews
                </Button>
              </TabsContent>

              <TabsContent value="changelog" className="mt-6 space-y-4">
                {agent.changelog.map((entry, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className="bg-violet-500/20 text-violet-400">{entry.version}</Badge>
                      <span className="text-sm text-gray-500">{entry.date}</span>
                    </div>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      {entry.changes.map((change, i) => (
                        <li key={i}>{change}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Purchase Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
              >
                {/* Price Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="text-4xl font-bold mb-2">
                    ${agent.price}
                    {agent.priceType === "monthly" && <span className="text-lg text-gray-400 font-normal">/month</span>}
                  </div>
                  <p className="text-gray-400">One-time purchase • Lifetime updates</p>
                </div>

                {/* Purchase Options */}
                <div className="p-6 space-y-4">
                  <Button
                    size="lg"
                    className="w-full h-14 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-lg"
                    onClick={handlePurchase}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Buy Now
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full h-14 border-white/20 hover:bg-white/10"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Try Demo
                  </Button>

                  {/* Features */}
                  <div className="pt-4 space-y-3">
                    {[
                      "Instant access after purchase",
                      "Lifetime updates included",
                      "Priority support",
                      "30-day money back guarantee",
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                        <Check className="w-4 h-4 text-emerald-400" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Creator Info */}
                <div className="p-6 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-lg font-semibold">
                      {agent.creator.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {agent.creator}
                        {agent.creatorVerified && <Shield className="w-4 h-4 text-cyan-400" />}
                      </div>
                      <Link href={`/creator/${agent.creator.toLowerCase()}`} className="text-sm text-violet-400 hover:underline">
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Related Agents */}
              <div className="mt-8">
                <h3 className="font-semibold mb-4">Related Agents</h3>
                <div className="space-y-3">
                  {agent.relatedAgents.map((related) => (
                    <Link key={related.id} href={`/marketplace/${related.id}`}>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-grow">
                          <div className="font-medium">{related.name}</div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Star className="w-3 h-3 text-amber-400 fill-current" />
                            {related.rating}
                          </div>
                        </div>
                        <div className="font-semibold">${related.price}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Report */}
              <button className="mt-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-400 transition-colors">
                <Flag className="w-4 h-4" />
                Report this agent
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
