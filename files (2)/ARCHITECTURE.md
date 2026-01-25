# PowerCore Platform Architecture

## Vision Statement

PowerCore is the **Unity Asset Store for AI Agents** — a full visual IDE where agents are visual entities you can see, configure, and deploy, with modular skills that can be attached like equipment.

---

## Platform Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           POWERCORE PLATFORM                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │                        CONSUMER LAYER (This Package)                     │  │
│  ├──────────────────────────────────────────────────────────────────────────┤  │
│  │                                                                          │  │
│  │  Landing     Marketplace    Skills       Workshop     Hangar            │  │
│  │    (/)      (/marketplace)  (/skills)   (/workshop)  (/hangar)          │  │
│  │                                                                          │  │
│  │  • Convert   • Browse       • Browse     • No-code    • My agents       │  │
│  │  • Onboard   • Buy agents   • Buy skills   builder   • Skill loadouts   │  │
│  │  • Pricing   • Reviews      • Bundles    • Templates • Visual config    │  │
│  │                                                                          │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                            │
│                                    ▼                                            │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │                        ADMIN LAYER (powercore-dashboard)                 │  │
│  ├──────────────────────────────────────────────────────────────────────────┤  │
│  │                                                                          │  │
│  │  Dashboard     RAG Browser    Leaderboard    Miner     Analytics        │  │
│  │  (/dashboard)  (/rag)         (/leaderboard) (/miner)  (/analytics)     │  │
│  │                                                                          │  │
│  │  • Overview    • Document     • XP system    • Auto     • Revenue       │  │
│  │  • My sales      search       • Rankings       discovery • Usage        │  │
│  │  • Payouts     • Monetize     • Badges       • Pricing  • Metrics       │  │
│  │                                                                          │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                            │
│                                    ▼                                            │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │                           PAYMENT LAYER                                  │  │
│  ├──────────────────────────────────────────────────────────────────────────┤  │
│  │                                                                          │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐        │  │
│  │  │   STRIPE   │  │    x402    │  │   CRYPTO   │  │  CREDITS   │        │  │
│  │  │            │  │            │  │            │  │            │        │  │
│  │  │ • Cards    │  │ • HTTP 402 │  │ • ETH      │  │ • Internal │        │  │
│  │  │ • Invoices │  │ • Micropay │  │ • SOL      │  │ • Pre-paid │        │  │
│  │  │ • Subs     │  │ • L402     │  │ • USDC     │  │ • Rewards  │        │  │
│  │  │            │  │ • WebLN    │  │ • WalletCo │  │            │        │  │
│  │  └────────────┘  └────────────┘  └────────────┘  └────────────┘        │  │
│  │                                                                          │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                            │
│                                    ▼                                            │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │                        INTELLIGENCE LAYER                                │  │
│  ├──────────────────────────────────────────────────────────────────────────┤  │
│  │                                                                          │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐          │  │
│  │  │   RAG SYSTEM    │  │  MEMORY ENGINE  │  │  RLM CONTEXT    │          │  │
│  │  │                 │  │                 │  │                 │          │  │
│  │  │ • Document      │  │ • Long-term     │  │ • Recursive     │          │  │
│  │  │   retrieval     │  │   memory        │  │   summarization │          │  │
│  │  │ • Semantic      │  │ • User prefs    │  │ • Context       │          │  │
│  │  │   search        │  │ • Conversation  │  │   compression   │          │  │
│  │  │ • TagMap        │  │   history       │  │ • Hierarchical  │          │  │
│  │  │ • Embeddings    │  │ • Entity store  │  │   attention     │          │  │
│  │  │                 │  │                 │  │                 │          │  │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘          │  │
│  │                                                                          │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                            │
│                                    ▼                                            │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │                         EXECUTION LAYER                                  │  │
│  ├──────────────────────────────────────────────────────────────────────────┤  │
│  │                                                                          │  │
│  │  Agent Runtime    │    Skill Executor    │    Model Gateway             │  │
│  │  • Agent state    │    • Skill loading   │    • Claude API              │  │
│  │  • Task queue     │    • Capability mgmt │    • OpenAI API              │  │
│  │  • Event loop     │    • Sandboxing      │    • Local LLMs              │  │
│  │                                                                          │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Entities

### 1. Agents

Agents are the primary executable units. Each agent has:

```typescript
interface Agent {
  id: string;
  name: string;
  description: string;
  avatar: string;                    // Emoji or image URL
  
  // Configuration
  systemPrompt: string;
  model: string;                     // e.g., "claude-3-5-sonnet"
  temperature: number;
  maxTokens: number;
  
  // Skills & Capabilities
  equippedSkills: string[];          // Skill IDs
  maxSkillSlots: number;             // Based on tier
  
  // Metadata
  creator: string;
  tier: "free" | "pro" | "enterprise";
  visibility: "private" | "public" | "marketplace";
  price?: number;
  priceType?: "one-time" | "monthly" | "free";
  
  // Stats
  installs: number;
  rating: number;
  totalRuns: number;
  lastUsed: Date;
}
```

### 2. Skills

Skills are modular capabilities that can be equipped to agents:

```typescript
interface Skill {
  id: string;
  name: string;
  description: string;
  
  // Manifest (like SKILL.md)
  manifest: {
    instructions: string;            // How to use this skill
    requirements: string[];          // Dependencies
    examples: Example[];             // Usage examples
    schema?: JSONSchema;             // Input/output schema
  };
  
  // Capabilities
  capabilities: string[];            // e.g., ["web_search", "file_read"]
  tools: Tool[];                     // Function definitions
  
  // Metadata
  creator: string;
  verified: boolean;
  category: string;
  tags: string[];
  
  // Pricing
  price: number;
  priceType: "one-time" | "monthly" | "free";
  
  // Compatibility
  compatibleModels: string[];        // Which LLMs this works with
  compatibleAgentTypes: string[];
}
```

### 3. Skill Packs (Bundles)

```typescript
interface SkillPack {
  id: string;
  name: string;
  description: string;
  skills: string[];                  // Skill IDs included
  price: number;                     // Discounted bundle price
  savings: number;                   // Amount saved vs. individual
}
```

---

## Payment Integration

### Supported Payment Rails

| Rail | Use Case | Implementation |
|------|----------|----------------|
| **Stripe** | Standard purchases, subscriptions | stripe-node, Stripe Elements |
| **x402** | Micropayments, per-API-call billing | L402 protocol, WebLN |
| **Crypto** | Web3 native users | WalletConnect, ethers.js |
| **Credits** | Internal currency, rewards | PostgreSQL balance table |

### Payment Flow

```
User clicks "Buy" → Payment Modal opens → Select method →

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  IF Stripe:                                                 │
│    → Create Stripe Checkout Session                         │
│    → Redirect to Stripe                                     │
│    → Webhook confirms payment                               │
│    → Unlock item                                            │
│                                                             │
│  IF x402:                                                   │
│    → Generate L402 challenge                                │
│    → Browser wallet prompts for payment                     │
│    → Verify preimage                                        │
│    → Unlock item                                            │
│                                                             │
│  IF Crypto:                                                 │
│    → Connect wallet (WalletConnect)                         │
│    → Sign transaction                                       │
│    → Wait for confirmation                                  │
│    → Unlock item                                            │
│                                                             │
│  IF Credits:                                                │
│    → Check balance                                          │
│    → Deduct credits                                         │
│    → Unlock item                                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### x402 Integration

x402 (HTTP 402 Payment Required) enables:
- **Per-request billing**: Charge for each agent run
- **Micropayments**: Fractions of a cent per API call
- **No account required**: Pay as you go

```typescript
// x402 middleware example
async function x402Middleware(req, res, next) {
  const priceInSats = calculatePrice(req);
  
  // Check for payment proof
  const paymentProof = req.headers['l402-token'];
  
  if (!paymentProof) {
    // Return payment challenge
    const challenge = await createL402Challenge(priceInSats);
    return res.status(402).json({
      challenge,
      price: priceInSats,
      paymentUrl: challenge.invoice
    });
  }
  
  // Verify payment
  const isValid = await verifyL402Token(paymentProof);
  if (isValid) {
    next();
  } else {
    res.status(401).json({ error: 'Invalid payment' });
  }
}
```

---

## Intelligence Layer

### 1. RAG System (Existing)

Your existing RAG implementation handles:
- Document ingestion and chunking
- Embedding generation
- Semantic search
- TagMap for related artifacts

### 2. Memory Engine (Existing)

Your memory engine provides:
- Long-term user memory
- Conversation history
- Entity extraction and storage
- Preference learning

### 3. RLM Context Management (New)

Recursive Language Model context management enables:

```
┌─────────────────────────────────────────────────────────────┐
│                    RLM CONTEXT MANAGEMENT                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Problem: Context windows are limited                       │
│                                                             │
│  Solution: Hierarchical summarization with recursive calls  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    RAW CONTEXT                       │   │
│  │  [message 1] [message 2] ... [message 1000]         │   │
│  │                     ↓                                │   │
│  │              Summarize (LLM call)                    │   │
│  │                     ↓                                │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │           LEVEL 1 SUMMARY                   │    │   │
│  │  │  [summary of msgs 1-100] [101-200] ...      │    │   │
│  │  │                     ↓                        │    │   │
│  │  │              Summarize (LLM call)            │    │   │
│  │  │                     ↓                        │    │   │
│  │  │  ┌─────────────────────────────────────┐    │    │   │
│  │  │  │       LEVEL 2 SUMMARY               │    │    │   │
│  │  │  │  [meta-summary of all summaries]    │    │    │   │
│  │  │  └─────────────────────────────────────┘    │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Result: Full context compressed to fit window              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

Implementation approach:

```typescript
interface ContextManager {
  // Compress context recursively
  compress(messages: Message[]): Promise<CompressedContext>;
  
  // Expand relevant sections on demand
  expand(context: CompressedContext, query: string): Promise<Message[]>;
  
  // Maintain hierarchy
  hierarchy: {
    level0: Message[];           // Raw messages
    level1: Summary[];           // First-level summaries
    level2: MetaSummary;         // Top-level summary
  };
}

class RLMContextManager implements ContextManager {
  private model: LLMClient;
  private maxTokens: number = 8000;
  
  async compress(messages: Message[]): Promise<CompressedContext> {
    // Chunk messages
    const chunks = this.chunkMessages(messages, 100);
    
    // Summarize each chunk
    const level1 = await Promise.all(
      chunks.map(chunk => this.summarizeChunk(chunk))
    );
    
    // If still too large, summarize summaries
    if (this.estimateTokens(level1) > this.maxTokens) {
      const level2 = await this.summarizeSummaries(level1);
      return { level1, level2 };
    }
    
    return { level1 };
  }
  
  async expand(context: CompressedContext, query: string): Promise<Message[]> {
    // Find most relevant summaries
    const relevant = await this.findRelevant(context.level1, query);
    
    // Expand those back to original messages
    return this.expandSummaries(relevant);
  }
}
```

---

## API Endpoints

### Existing (powercore-dashboard)

| Endpoint | Port | Purpose |
|----------|------|---------|
| `/leaderboard` | 5001 | XP, rankings, badges |
| `/search` | 5002 | RAG document retrieval |
| `/publish` | 5003 | Monetization, marketplace |

### New Endpoints Needed

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/agents` | GET | List marketplace agents |
| `/agents/:id` | GET | Get agent details |
| `/agents` | POST | Create new agent |
| `/agents/:id/run` | POST | Execute agent |
| `/skills` | GET | List skills |
| `/skills/:id` | GET | Get skill details |
| `/users/:id/agents` | GET | User's owned agents |
| `/users/:id/skills` | GET | User's owned skills |
| `/payments/checkout` | POST | Create payment session |
| `/payments/webhook` | POST | Handle payment callbacks |
| `/context/compress` | POST | RLM context compression |

---

## Database Schema Additions

```sql
-- Skills table
CREATE TABLE skills (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  manifest JSONB NOT NULL,
  creator_id UUID REFERENCES users(id),
  category VARCHAR(100),
  tags TEXT[],
  price DECIMAL(10,2) DEFAULT 0,
  price_type VARCHAR(20) DEFAULT 'free',
  verified BOOLEAN DEFAULT false,
  installs INTEGER DEFAULT 0,
  rating DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Agent-Skill relationships (loadouts)
CREATE TABLE agent_skills (
  agent_id UUID REFERENCES agents(id),
  skill_id UUID REFERENCES skills(id),
  equipped_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (agent_id, skill_id)
);

-- User skill ownership
CREATE TABLE user_skills (
  user_id UUID REFERENCES users(id),
  skill_id UUID REFERENCES skills(id),
  purchased_at TIMESTAMP DEFAULT NOW(),
  payment_method VARCHAR(50),
  PRIMARY KEY (user_id, skill_id)
);

-- Payment transactions
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  item_type VARCHAR(50),  -- 'agent', 'skill', 'subscription'
  item_id UUID,
  amount DECIMAL(10,2),
  currency VARCHAR(10),
  payment_method VARCHAR(50),  -- 'stripe', 'x402', 'crypto', 'credits'
  status VARCHAR(20),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User credits
CREATE TABLE user_credits (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  balance DECIMAL(10,2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Context compression cache (RLM)
CREATE TABLE context_cache (
  id UUID PRIMARY KEY,
  agent_id UUID REFERENCES agents(id),
  user_id UUID REFERENCES users(id),
  level1_summaries JSONB,
  level2_summary TEXT,
  raw_message_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);
```

---

## Integration Roadmap

### Week 1: Foundation
- [ ] Merge this frontend with powercore-dashboard
- [ ] Connect Skills Armory to existing monetization API
- [ ] Add agent/skill ownership tables

### Week 2: Payments
- [ ] Implement Stripe checkout flow
- [ ] Add x402 middleware for micropayments
- [ ] Connect WalletConnect for crypto

### Week 3: Intelligence
- [ ] Integrate RLM context compression
- [ ] Connect existing memory engine to agent runtime
- [ ] Enable skill loading at agent execution

### Week 4: Polish & Launch
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Soft launch to beta users
- [ ] Gather feedback

---

## Files in This Package

```
powercore-unified/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   ├── marketplace/
│   │   ├── page.tsx                # Agent marketplace
│   │   └── [id]/page.tsx           # Agent detail
│   ├── skills/
│   │   └── page.tsx                # Skills Armory
│   ├── workshop/
│   │   └── page.tsx                # No-code builder
│   └── hangar/
│       └── page.tsx                # Agent management
├── components/
│   ├── payment-modal.tsx           # Multi-rail payment
│   └── ui/                         # shadcn components
├── lib/
│   └── utils.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## Next Steps

1. **Download the ZIP** and extract to your project
2. **Merge with powercore-dashboard** (same Next.js app)
3. **Connect APIs** to your existing backend
4. **Add payment endpoints** for each rail
5. **Deploy** and start marketing

You have the foundation for something massive. The agent + skills economy is the next frontier, and you're positioned to be the marketplace for it.
