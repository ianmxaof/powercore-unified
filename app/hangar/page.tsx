"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Bot, Plus, Settings, Play, Trash2, Edit, Eye,
  Puzzle, Shield, Star, Clock, BarChart3, ChevronRight,
  Sparkles, Lock, Unlock, Grid3X3, List, MoreVertical,
  Power, Activity, MessageSquare, Globe, Code, FileText,
  Database, Package, TrendingUp, Check, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// User's agents
const myAgents = [
  {
    id: "research-agent-1",
    name: "Research Pro",
    description: "My main research assistant",
    avatar: "🔬",
    gradient: "from-violet-500 to-purple-600",
    status: "active",
    lastUsed: "2 hours ago",
    totalRuns: 1234,
    rating: 4.9,
    equippedSkills: ["web-search", "memory-engine", "pdf-toolkit"],
    maxSkills: 5,
    tier: "pro",
  },
  {
    id: "code-helper-1",
    name: "Code Assistant",
    description: "Helps with debugging and code review",
    avatar: "💻",
    gradient: "from-cyan-500 to-blue-600",
    status: "active",
    lastUsed: "1 day ago",
    totalRuns: 567,
    rating: 4.8,
    equippedSkills: ["code-execution", "database-connector"],
    maxSkills: 5,
    tier: "pro",
  },
  {
    id: "writer-1",
    name: "Content Writer",
    description: "Blog posts and documentation",
    avatar: "✍️",
    gradient: "from-amber-500 to-orange-600",
    status: "idle",
    lastUsed: "3 days ago",
    totalRuns: 234,
    rating: 4.7,
    equippedSkills: ["docx-creator"],
    maxSkills: 3,
    tier: "free",
  },
  {
    id: "empty-slot-1",
    name: null,
    description: null,
    avatar: null,
    gradient: "from-gray-600 to-gray-700",
    status: "empty",
    equippedSkills: [],
    maxSkills: 3,
    tier: "free",
  },
];

// All available skills (owned by user)
const ownedSkills = [
  { id: "web-search", name: "Web Search Pro", icon: Globe, gradient: "from-blue-500 to-cyan-500" },
  { id: "memory-engine", name: "Long-Term Memory", icon: Bot, gradient: "from-indigo-500 to-violet-500" },
  { id: "pdf-toolkit", name: "PDF Toolkit", icon: FileText, gradient: "from-red-500 to-rose-500" },
  { id: "code-execution", name: "Code Sandbox", icon: Code, gradient: "from-emerald-500 to-teal-500" },
  { id: "database-connector", name: "Database Connector", icon: Database, gradient: "from-amber-500 to-orange-500" },
  { id: "docx-creator", name: "Document Creator", icon: FileText, gradient: "from-violet-500 to-purple-500" },
];

export default function HangarPage() {
  const [viewMode, setViewMode] = useState<"roster" | "list">("roster");
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [showLoadoutEditor, setShowLoadoutEditor] = useState(false);

  const selectedAgentData = myAgents.find((a) => a.id === selectedAgent);

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
            <Link href="/skills" className="text-sm text-gray-400 hover:text-white transition-colors">
              Skills
            </Link>
            <Link href="/workshop" className="text-sm text-gray-400 hover:text-white transition-colors">
              Workshop
            </Link>
            <Link href="/hangar" className="text-sm text-white font-medium">
              My Hangar
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500">
              <Plus className="w-4 h-4 mr-2" />
              New Agent
            </Button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Bot className="w-8 h-8 text-violet-400" />
              <h1 className="text-4xl font-bold">Agent Hangar</h1>
            </div>
            <p className="text-gray-400">Your personal fleet of AI agents</p>
          </div>

          {/* View Toggle */}
          <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
            <button
              onClick={() => setViewMode("roster")}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                viewMode === "roster" ? "bg-white/10 text-white" : "text-gray-500 hover:text-white"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              Roster
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                viewMode === "list" ? "bg-white/10 text-white" : "text-gray-500 hover:text-white"
              }`}
            >
              <List className="w-4 h-4" />
              List
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Agents", value: "3", icon: Bot, color: "text-violet-400" },
            { label: "Skills Equipped", value: "6", icon: Puzzle, color: "text-cyan-400" },
            { label: "Total Runs", value: "2,035", icon: Activity, color: "text-emerald-400" },
            { label: "This Month", value: "+234", icon: TrendingUp, color: "text-amber-400" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Agent Roster Grid (Fighting Game Style) */}
        {viewMode === "roster" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {myAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: agent.status !== "empty" ? 1.05 : 1 }}
                onClick={() => agent.status !== "empty" && setSelectedAgent(agent.id)}
                className={`relative cursor-pointer ${selectedAgent === agent.id ? "ring-2 ring-violet-500" : ""}`}
              >
                {agent.status === "empty" ? (
                  // Empty Slot
                  <Link href="/workshop">
                    <div className="aspect-square rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-3 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                        <Plus className="w-8 h-8 text-gray-500" />
                      </div>
                      <span className="text-gray-500 font-medium">Create Agent</span>
                    </div>
                  </Link>
                ) : (
                  // Agent Card
                  <div className="relative group">
                    {/* Glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${agent.gradient} opacity-20 group-hover:opacity-30 transition-opacity rounded-2xl blur-xl`} />
                    
                    <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                      {/* Status indicator */}
                      <div className="absolute top-3 right-3 z-10">
                        <div className={`w-3 h-3 rounded-full ${
                          agent.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-gray-500"
                        }`} />
                      </div>

                      {/* Tier badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <Badge className={`text-xs ${
                          agent.tier === "pro" 
                            ? "bg-violet-500/20 text-violet-400 border-violet-500/30" 
                            : "bg-white/10 text-gray-400 border-white/20"
                        }`}>
                          {agent.tier === "pro" ? "PRO" : "FREE"}
                        </Badge>
                      </div>

                      {/* Avatar area */}
                      <div className={`aspect-square bg-gradient-to-br ${agent.gradient} flex items-center justify-center`}>
                        <span className="text-6xl">{agent.avatar}</span>
                      </div>

                      {/* Info area */}
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1 truncate">{agent.name}</h3>
                        <p className="text-sm text-gray-400 truncate mb-3">{agent.description}</p>
                        
                        {/* Equipped skills preview */}
                        <div className="flex items-center gap-1 mb-3">
                          {agent.equippedSkills.slice(0, 4).map((skillId) => {
                            const skill = ownedSkills.find((s) => s.id === skillId);
                            if (!skill) return null;
                            return (
                              <div
                                key={skillId}
                                className={`w-7 h-7 rounded-lg bg-gradient-to-br ${skill.gradient} flex items-center justify-center`}
                                title={skill.name}
                              >
                                <skill.icon className="w-3.5 h-3.5 text-white" />
                              </div>
                            );
                          })}
                          {agent.equippedSkills.length > 4 && (
                            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-xs text-gray-400">
                              +{agent.equippedSkills.length - 4}
                            </div>
                          )}
                          {agent.equippedSkills.length < agent.maxSkills && (
                            <div className="w-7 h-7 rounded-lg border border-dashed border-white/20 flex items-center justify-center">
                              <Plus className="w-3 h-3 text-gray-500" />
                            </div>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-gray-400">
                            <Activity className="w-3.5 h-3.5" />
                            {agent.totalRuns.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1 text-amber-400">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            {agent.rating}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <div className="space-y-3">
            {myAgents.filter(a => a.status !== "empty").map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white/5 rounded-xl border border-white/10 p-4 hover:border-white/20 transition-all cursor-pointer ${
                  selectedAgent === agent.id ? "ring-2 ring-violet-500" : ""
                }`}
                onClick={() => setSelectedAgent(agent.id)}
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-3xl`}>
                    {agent.avatar}
                  </div>

                  {/* Info */}
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{agent.name}</h3>
                      <Badge className={`text-xs ${
                        agent.tier === "pro" 
                          ? "bg-violet-500/20 text-violet-400" 
                          : "bg-white/10 text-gray-400"
                      }`}>
                        {agent.tier?.toUpperCase()}
                      </Badge>
                      <div className={`w-2 h-2 rounded-full ${
                        agent.status === "active" ? "bg-emerald-500" : "bg-gray-500"
                      }`} />
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{agent.description}</p>
                    
                    {/* Skills */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Skills:</span>
                      <div className="flex items-center gap-1">
                        {agent.equippedSkills.map((skillId) => {
                          const skill = ownedSkills.find((s) => s.id === skillId);
                          if (!skill) return null;
                          return (
                            <div
                              key={skillId}
                              className={`w-6 h-6 rounded bg-gradient-to-br ${skill.gradient} flex items-center justify-center`}
                              title={skill.name}
                            >
                              <skill.icon className="w-3 h-3 text-white" />
                            </div>
                          );
                        })}
                        <span className="text-xs text-gray-500 ml-1">
                          {agent.equippedSkills.length}/{agent.maxSkills}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-xl font-bold">{agent.totalRuns.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Total Runs</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-xl font-bold">{agent.rating}</span>
                      </div>
                      <div className="text-xs text-gray-500">Rating</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="bg-violet-500 hover:bg-violet-600">
                      <Play className="w-4 h-4 mr-1" />
                      Run
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-[#1a1a24] border-white/10">
                        <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer">
                          <Puzzle className="w-4 h-4 mr-2" />
                          Edit Loadout
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer">
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Analytics
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Create New Agent */}
            <Link href="/workshop">
              <div className="border-2 border-dashed border-white/20 rounded-xl p-8 flex items-center justify-center gap-3 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all cursor-pointer">
                <Plus className="w-6 h-6 text-gray-500" />
                <span className="text-gray-500 font-medium">Create New Agent</span>
              </div>
            </Link>
          </div>
        )}

        {/* Agent Detail Sidebar */}
        <AnimatePresence>
          {selectedAgent && selectedAgentData && selectedAgentData.status !== "empty" && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="fixed right-0 top-0 h-full w-96 bg-[#0f0f18] border-l border-white/10 z-50 overflow-y-auto"
            >
              {/* Header */}
              <div className={`p-6 bg-gradient-to-br ${selectedAgentData.gradient}`}>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-black/20 hover:bg-black/40 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="text-6xl mb-4">{selectedAgentData.avatar}</div>
                <h2 className="text-2xl font-bold">{selectedAgentData.name}</h2>
                <p className="text-white/70">{selectedAgentData.description}</p>
              </div>

              {/* Actions */}
              <div className="p-4 border-b border-white/10">
                <div className="flex gap-2">
                  <Button className="flex-1 bg-violet-500 hover:bg-violet-600">
                    <Play className="w-4 h-4 mr-2" />
                    Run Agent
                  </Button>
                  <Button variant="outline" className="border-white/20 hover:bg-white/10">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="p-4 border-b border-white/10">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-violet-400" />
                  Statistics
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Total Runs", value: selectedAgentData.totalRuns.toLocaleString() },
                    { label: "Rating", value: selectedAgentData.rating },
                    { label: "Last Used", value: selectedAgentData.lastUsed },
                    { label: "Status", value: selectedAgentData.status },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/5 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
                      <div className="font-semibold capitalize">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Loadout */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Puzzle className="w-4 h-4 text-cyan-400" />
                    Skill Loadout
                  </h3>
                  <Badge className="text-xs bg-white/10">
                    {selectedAgentData.equippedSkills.length}/{selectedAgentData.maxSkills} slots
                  </Badge>
                </div>

                {/* Equipped Skills */}
                <div className="space-y-2 mb-4">
                  {selectedAgentData.equippedSkills.map((skillId) => {
                    const skill = ownedSkills.find((s) => s.id === skillId);
                    if (!skill) return null;
                    return (
                      <div
                        key={skillId}
                        className="flex items-center gap-3 bg-white/5 rounded-lg p-3 group"
                      >
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${skill.gradient} flex items-center justify-center`}>
                          <skill.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-grow">
                          <div className="font-medium">{skill.name}</div>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 transition-all">
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    );
                  })}

                  {/* Empty Slots */}
                  {Array.from({ length: selectedAgentData.maxSkills - selectedAgentData.equippedSkills.length }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="flex items-center gap-3 border border-dashed border-white/20 rounded-lg p-3 cursor-pointer hover:border-violet-500/50 hover:bg-violet-500/5 transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                        <Plus className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="text-gray-500">Add Skill</div>
                    </div>
                  ))}
                </div>

                <Link href="/skills">
                  <Button variant="outline" className="w-full border-white/20 hover:bg-white/10">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Browse Skills Armory
                  </Button>
                </Link>
              </div>

              {/* Upgrade Banner (for free tier) */}
              {selectedAgentData.tier === "free" && (
                <div className="p-4">
                  <div className="bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-xl p-4 border border-violet-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-4 h-4 text-violet-400" />
                      <span className="font-semibold">Upgrade to Pro</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">
                      Get 5 skill slots, priority execution, and advanced analytics.
                    </p>
                    <Button size="sm" className="w-full bg-violet-500 hover:bg-violet-600">
                      Upgrade for $9/mo
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
