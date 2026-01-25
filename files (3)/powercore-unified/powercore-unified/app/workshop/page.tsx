"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Zap, ArrowLeft, ArrowRight, Check, Sparkles,
  FileText, Code, Search, MessageSquare, Database, Shield,
  Globe, Send, Play, Settings, Upload, Eye, Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Agent templates
const templates = [
  {
    id: "research",
    name: "Research Agent",
    description: "Deep web research with source citations",
    icon: Search,
    gradient: "from-violet-500 to-purple-600",
    defaultPrompt: "You are a research assistant. Search the web thoroughly, cite your sources, and provide comprehensive answers with references.",
    tools: ["web_search", "file_read"],
  },
  {
    id: "writer",
    name: "Content Writer",
    description: "Blog posts, articles, and marketing copy",
    icon: FileText,
    gradient: "from-amber-500 to-orange-600",
    defaultPrompt: "You are a professional content writer. Create engaging, well-structured content optimized for readability and SEO.",
    tools: ["file_read", "file_write"],
  },
  {
    id: "coder",
    name: "Code Assistant",
    description: "Code review, debugging, and generation",
    icon: Code,
    gradient: "from-cyan-500 to-blue-600",
    defaultPrompt: "You are an expert programmer. Help with code review, debugging, and writing clean, efficient code with best practices.",
    tools: ["code_execution", "file_read", "file_write"],
  },
  {
    id: "chat",
    name: "Chat Assistant",
    description: "Conversational AI for any purpose",
    icon: MessageSquare,
    gradient: "from-emerald-500 to-teal-600",
    defaultPrompt: "You are a helpful assistant. Engage in natural conversation and help users with their questions and tasks.",
    tools: [],
  },
  {
    id: "data",
    name: "Data Analyst",
    description: "Analyze data and generate insights",
    icon: Database,
    gradient: "from-pink-500 to-rose-600",
    defaultPrompt: "You are a data analyst. Analyze datasets, identify patterns, generate visualizations, and provide actionable insights.",
    tools: ["code_execution", "file_read"],
  },
  {
    id: "blank",
    name: "Start from Scratch",
    description: "Build a custom agent from the ground up",
    icon: Sparkles,
    gradient: "from-slate-500 to-gray-600",
    defaultPrompt: "",
    tools: [],
  },
];

// Available tools/capabilities
const availableTools = [
  { id: "web_search", name: "Web Search", description: "Search the internet", icon: Globe },
  { id: "file_read", name: "File Read", description: "Read uploaded files", icon: FileText },
  { id: "file_write", name: "File Write", description: "Create and save files", icon: Upload },
  { id: "code_execution", name: "Code Execution", description: "Run Python code", icon: Code },
  { id: "api_calls", name: "API Calls", description: "Make HTTP requests", icon: Send },
];

// Available models
const models = [
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", recommended: true },
  { id: "claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic", recommended: false },
  { id: "gpt-4-turbo", name: "GPT-4 Turbo", provider: "OpenAI", recommended: false },
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", recommended: false },
];

const steps = [
  { id: 1, name: "Template", description: "Choose a starting point" },
  { id: 2, name: "Configure", description: "Set up your agent" },
  { id: 3, name: "Test", description: "Try it out" },
  { id: 4, name: "Deploy", description: "Launch your agent" },
];

export default function WorkshopPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  // Agent configuration state
  const [agentConfig, setAgentConfig] = useState({
    name: "",
    description: "",
    systemPrompt: "",
    model: "claude-3-5-sonnet",
    tools: [] as string[],
    temperature: 0.7,
    maxTokens: 4096,
  });

  // Test chat state
  const [testMessages, setTestMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [testInput, setTestInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Deploy options
  const [deployConfig, setDeployConfig] = useState({
    visibility: "private" as "private" | "public" | "marketplace",
    price: 0,
    priceType: "one-time" as "one-time" | "monthly" | "free",
  });

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setAgentConfig((prev) => ({
        ...prev,
        systemPrompt: template.defaultPrompt,
        tools: template.tools,
      }));
    }
  };

  const toggleTool = (toolId: string) => {
    setAgentConfig((prev) => ({
      ...prev,
      tools: prev.tools.includes(toolId)
        ? prev.tools.filter((t) => t !== toolId)
        : [...prev.tools, toolId],
    }));
  };

  const handleTestSend = async () => {
    if (!testInput.trim()) return;
    
    const userMessage = { role: "user", content: testInput };
    setTestMessages((prev) => [...prev, userMessage]);
    setTestInput("");
    setIsGenerating(true);

    // Simulate AI response (in production, call your backend)
    setTimeout(() => {
      const assistantMessage = {
        role: "assistant",
        content: `This is a simulated response from your "${agentConfig.name || "Agent"}" based on your system prompt. In production, this would call the actual LLM API with your configuration.`,
      };
      setTestMessages((prev) => [...prev, assistantMessage]);
      setIsGenerating(false);
    }, 1500);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedTemplate !== null;
      case 2:
        return agentConfig.name.trim() && agentConfig.systemPrompt.trim();
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

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
            <Link href="/workshop" className="text-sm text-white font-medium">
              Workshop
            </Link>
            <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
              Dashboard
            </Link>
          </div>

          <Button className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white border-0">
            Save Progress
          </Button>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Agent Workshop</h1>
          <p className="text-gray-400">Create custom AI agents without writing code</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      currentStep > step.id
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : currentStep === step.id
                        ? "bg-violet-500 border-violet-500 text-white"
                        : "bg-transparent border-white/20 text-gray-500"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="font-medium">{step.id}</span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div className={`text-sm font-medium ${currentStep >= step.id ? "text-white" : "text-gray-500"}`}>
                      {step.name}
                    </div>
                    <div className="text-xs text-gray-500 hidden sm:block">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-24 h-0.5 mx-4 ${
                      currentStep > step.id ? "bg-emerald-500" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* Step 1: Template Selection */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-2xl font-semibold mb-6">Choose a template</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <motion.button
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`text-left p-6 rounded-2xl border transition-all ${
                      selectedTemplate === template.id
                        ? "bg-white/10 border-violet-500"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.gradient} flex items-center justify-center mb-4`}>
                      <template.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-400">{template.description}</p>
                    {selectedTemplate === template.id && (
                      <div className="mt-4 flex items-center gap-2 text-violet-400">
                        <Check className="w-4 h-4" />
                        <span className="text-sm">Selected</span>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Configuration */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left: Basic Info */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold">Configure your agent</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Agent Name *</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Research Assistant Pro"
                        value={agentConfig.name}
                        onChange={(e) => setAgentConfig({ ...agentConfig, name: e.target.value })}
                        className="mt-2 bg-white/5 border-white/10 h-12"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Short Description</Label>
                      <Input
                        id="description"
                        placeholder="A brief description of what your agent does"
                        value={agentConfig.description}
                        onChange={(e) => setAgentConfig({ ...agentConfig, description: e.target.value })}
                        className="mt-2 bg-white/5 border-white/10 h-12"
                      />
                    </div>

                    <div>
                      <Label htmlFor="model">AI Model</Label>
                      <Select
                        value={agentConfig.model}
                        onValueChange={(value) => setAgentConfig({ ...agentConfig, model: value })}
                      >
                        <SelectTrigger className="mt-2 bg-white/5 border-white/10 h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a24] border-white/10">
                          {models.map((model) => (
                            <SelectItem key={model.id} value={model.id} className="text-white hover:bg-white/10">
                              <div className="flex items-center gap-2">
                                {model.name}
                                {model.recommended && (
                                  <Badge className="bg-violet-500/20 text-violet-400 text-xs">Recommended</Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="prompt">System Prompt *</Label>
                      <Textarea
                        id="prompt"
                        placeholder="Describe your agent's personality, capabilities, and how it should behave..."
                        value={agentConfig.systemPrompt}
                        onChange={(e) => setAgentConfig({ ...agentConfig, systemPrompt: e.target.value })}
                        className="mt-2 bg-white/5 border-white/10 min-h-[200px] resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        This tells the AI how to behave. Be specific about its role, tone, and capabilities.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Tools & Settings */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold">Capabilities</h2>

                  <div className="space-y-3">
                    {availableTools.map((tool) => (
                      <div
                        key={tool.id}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                          agentConfig.tools.includes(tool.id)
                            ? "bg-violet-500/10 border-violet-500/50"
                            : "bg-white/5 border-white/10 hover:border-white/20"
                        }`}
                        onClick={() => toggleTool(tool.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            agentConfig.tools.includes(tool.id) ? "bg-violet-500" : "bg-white/10"
                          }`}>
                            <tool.icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">{tool.name}</div>
                            <div className="text-sm text-gray-400">{tool.description}</div>
                          </div>
                        </div>
                        <Switch
                          checked={agentConfig.tools.includes(tool.id)}
                          onCheckedChange={() => toggleTool(tool.id)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Advanced Settings */}
                  <div className="pt-6 border-t border-white/10">
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Advanced Settings
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Temperature</Label>
                          <span className="text-sm text-gray-400">{agentConfig.temperature}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={agentConfig.temperature}
                          onChange={(e) => setAgentConfig({ ...agentConfig, temperature: parseFloat(e.target.value) })}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Lower = more focused, Higher = more creative
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Test */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-2xl font-semibold mb-6">Test your agent</h2>
              
              <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                {/* Chat Header */}
                <div className="p-4 border-b border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">{agentConfig.name || "Your Agent"}</div>
                    <div className="text-sm text-gray-400">Testing mode</div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                  {testMessages.length === 0 && (
                    <div className="text-center text-gray-500 py-12">
                      <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Send a message to test your agent</p>
                    </div>
                  )}
                  {testMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-violet-500 text-white"
                            : "bg-white/10 text-gray-100"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {isGenerating && (
                    <div className="flex justify-start">
                      <div className="bg-white/10 rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-white/10">
                  <div className="flex gap-3">
                    <Input
                      placeholder="Type a message..."
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleTestSend()}
                      className="bg-white/5 border-white/10 h-12"
                    />
                    <Button
                      onClick={handleTestSend}
                      disabled={isGenerating || !testInput.trim()}
                      className="bg-violet-500 hover:bg-violet-600 h-12 px-6"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Deploy */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-2xl font-semibold mb-6">Deploy your agent</h2>

              <div className="space-y-6">
                {/* Visibility Options */}
                <div className="space-y-3">
                  <Label>Visibility</Label>
                  {[
                    { id: "private", label: "Private", description: "Only you can use this agent", icon: Shield },
                    { id: "public", label: "Shared Link", description: "Anyone with the link can use it", icon: Globe },
                    { id: "marketplace", label: "Marketplace", description: "List it for others to buy", icon: Sparkles },
                  ].map((option) => (
                    <div
                      key={option.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                        deployConfig.visibility === option.id
                          ? "bg-violet-500/10 border-violet-500"
                          : "bg-white/5 border-white/10 hover:border-white/20"
                      }`}
                      onClick={() => setDeployConfig({ ...deployConfig, visibility: option.id as any })}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        deployConfig.visibility === option.id ? "bg-violet-500" : "bg-white/10"
                      }`}>
                        <option.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-400">{option.description}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        deployConfig.visibility === option.id ? "border-violet-500 bg-violet-500" : "border-white/30"
                      }`}>
                        {deployConfig.visibility === option.id && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing (only for marketplace) */}
                {deployConfig.visibility === "marketplace" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-4 pt-4 border-t border-white/10"
                  >
                    <Label>Pricing</Label>
                    <div className="flex gap-3">
                      {[
                        { id: "free", label: "Free" },
                        { id: "one-time", label: "One-time" },
                        { id: "monthly", label: "Monthly" },
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setDeployConfig({ ...deployConfig, priceType: type.id as any })}
                          className={`px-4 py-2 rounded-lg border transition-all ${
                            deployConfig.priceType === type.id
                              ? "bg-violet-500 border-violet-500 text-white"
                              : "bg-white/5 border-white/10 hover:border-white/20"
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>

                    {deployConfig.priceType !== "free" && (
                      <div>
                        <Label>Price (USD)</Label>
                        <div className="relative mt-2">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                          <Input
                            type="number"
                            min="1"
                            value={deployConfig.price}
                            onChange={(e) => setDeployConfig({ ...deployConfig, price: parseInt(e.target.value) || 0 })}
                            className="pl-8 bg-white/5 border-white/10 h-12"
                          />
                          {deployConfig.priceType === "monthly" && (
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">/month</span>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Summary */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="font-semibold mb-4">Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Agent Name</span>
                      <span>{agentConfig.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Model</span>
                      <span>{models.find(m => m.id === agentConfig.model)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Capabilities</span>
                      <span>{agentConfig.tools.length} enabled</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Visibility</span>
                      <span className="capitalize">{deployConfig.visibility}</span>
                    </div>
                    {deployConfig.visibility === "marketplace" && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Price</span>
                        <span>
                          {deployConfig.priceType === "free"
                            ? "Free"
                            : `$${deployConfig.price}${deployConfig.priceType === "monthly" ? "/mo" : ""}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Deploy Button */}
                <Button
                  size="lg"
                  className="w-full h-14 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-lg"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Deploy Agent
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12 pt-8 border-t border-white/10">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            disabled={currentStep === 1}
            className="border-white/20 hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < 4 && (
            <Button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              disabled={!canProceed()}
              className="bg-violet-500 hover:bg-violet-600"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
