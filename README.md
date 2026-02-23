<div align="center">

# 🔱 OwnerCord

### Advanced Discord OAuth2 Bot Management & Authentication System

---

> **📢 Project Status Notice**
> 
> This project was completed approximately 2 years ago and has been sitting idle. Currently, the latest version manages all these commands through a website with only 1 main bot. If you want the newest updated version (Version 5.0), I recommend giving it a nice star and following the project. If it reaches over 100 stars, the new version will be released directly to you and **OwnerCord will discontinue its use.**

---

![OwnerCord Logo](API/Views/assets/img/logo.png)

[![License](https://img.shields.io/badge/license-ISC-blue.svg?style=for-the-badge)](LICENSE)
[![Discord.js](https://img.shields.io/badge/discord.js-v14.13.0-5865F2.svg?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org/)
[![Node.js](https://img.shields.io/badge/node.js-16.x+-339933.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248.svg?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![PM2](https://img.shields.io/badge/PM2-Process%20Manager-2B037A.svg?style=for-the-badge&logo=pm2&logoColor=white)](https://pm2.keymetrics.io/)

**A powerful, scalable Discord bot management system with OAuth2 authentication, auto-join, auto-role, and advanced member control features.**

[Features](#-features) • [Installation](#-installation) • [Documentation](#-documentation) • [Commands](#-commands) • [Support](#-support)

---

</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Commands](#-commands)
- [Pricing Plans](#-pricing-plans)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

---

## 🌟 Overview

OwnerCord is a comprehensive Discord bot management platform that leverages OAuth2 authentication to provide advanced server management capabilities. Built with scalability in mind, it supports multiple bots, automated member management, and real-time logging through a centralized control system.

### Why OwnerCord?

- **🚀 Scalable**: Manage unlimited bots from a single dashboard
- **🔐 Secure**: OAuth2 authentication with token encryption
- **⚡ Fast**: PM2 process management for optimal performance
- **📊 Insightful**: Real-time analytics and comprehensive logging
- **🎯 Feature-Rich**: Auto-join, auto-role, force member, and more
- **💎 Flexible**: Three-tier pricing system for different needs

---

## ✨ Features

### 🔐 OAuth2 Authentication System

<table>
<tr>
<td width="50%">

**Secure User Verification**
- Discord OAuth2 integration
- Automatic server joining
- Real-time user tracking
- IP and locale detection
- Token refresh mechanism

</td>
<td width="50%">

**Customizable Verification**
- 🔞 Nude Verify (Premium)
- 🔥 NSFW Verify (Premium)
- 💎 Nitro Verify (Premium)
- ✅ Normal Verify (All Plans)

</td>
</tr>
</table>

### 🤖 Bot Management

- **Multi-Bot Support**: Manage unlimited Discord bots from one place
- **PM2 Integration**: Automatic bot startup, restart, and monitoring
- **Status Control**: Custom bot status, activities, and presence
- **Webhook Logging**: Detailed logs for auth events and commands
- **Switch Key System**: Recover bot access with secure switch keys
- **Client Secret Management**: Secure OAuth2 credential storage

### 🎯 Advanced Features

| Feature | Description | Plan Required |
|---------|-------------|---------------|
| **Auto-Joiner** | Automatically add OAuth users to your server | VIP+ |
| **Force Member** | Prevent users from leaving your server | Premium |
| **Auto-Role** | Assign roles automatically upon verification | VIP+ |
| **Auto-Message** | Send custom DMs to verified users | VIP+ |
| **Whitelist System** | Server and user whitelist management | All Plans |
| **OAuth Management** | View, track, and manage all OAuth sessions | All Plans |

### 📊 Management Dashboard

- Interactive Discord embed-based control panel
- Real-time statistics (servers, users, auths)
- Bot creation and configuration interface
- Feature toggle system
- Admin and user permission levels

---

## 🏗 System Architecture

OwnerCord consists of three interconnected modules working together:

```
┌─────────────────────────────────────────────────────────────┐
│                        OwnerCord System                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐ │
│  │     API     │◄────►│   Manager   │◄────►│   Client    │ │
│  │   Module    │      │   Module    │      │   Module    │ │
│  └─────────────┘      └─────────────┘      └─────────────┘ │
│        │                     │                     │         │
│        │                     │                     │         │
│        └─────────────────────┴─────────────────────┘         │
│                              │                                │
│                    ┌─────────▼─────────┐                     │
│                    │   MongoDB Atlas   │                     │
│                    └───────────────────┘                     │
└─────────────────────────────────────────────────────────────┘
```

### 📦 Module Breakdown

#### 🌐 API Module
The OAuth2 callback handler and web server

- **Express.js** web server on configurable port
- **OAuth2 callback** processing and token management
- **EJS templates** for verification pages
- **Cron jobs** for routine health checks
- **Request tracking** with IP and locale detection

**Key Files:**
- `API/index.js` - Main entry point
- `API/Class/Callback.js` - OAuth2 callback handler
- `API/Views/` - Verification page templates

#### 🎮 Manager Module
Central bot creation and management system

- **Bot creation** via Discord slash commands
- **PM2 integration** for process management
- **Admin panel** with interactive controls
- **Webhook notifications** for system events
- **Developer dashboard** with full system access

**Key Files:**
- `Manager/OwnerCord-Manager.js` - Main entry point
- `Manager/Commands/[1]-Create.js` - Bot creation logic
- `Manager/Events/Panel-Interaction-*.js` - Panel handlers

#### 🤖 Client Module
Individual bot instances with full feature set

- **Discord.js v14** bot client
- **Slash commands** for all features
- **Event handlers** for guild and member events
- **Feature management** (Joiner, Roles, Messages)
- **OAuth session** tracking and management

**Key Files:**
- `Client/OwnerManager_Auth.js` - Main entry point
- `Client/Commands/` - All bot commands
- `Client/Events/` - Event handlers

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v16.x or higher ([Download](https://nodejs.org/))
- **MongoDB** database ([MongoDB Atlas](https://www.mongodb.com/cloud/atlas) recommended)
- **PM2** process manager (optional but recommended)
- **Discord Bot** with OAuth2 credentials

### Quick Start

#### Step 1: Clone the Repository

```bash
git clone https://github.com/RowyHere/discord-ownercord-oauths.git
cd ownercord
```

#### Step 2: Install Dependencies

**Option A: Automated Installation (Windows)**
```bash
install.bat
```

**Option B: Manual Installation**
```bash
# Install API dependencies
cd API
npm install

# Install Client dependencies
cd ../Client
npm install

# Install Manager dependencies
cd ../Manager
npm install
```

#### Step 3: Configure Environment

Create your MongoDB database and obtain the connection string. Then configure each module:

**API Configuration** (`API/index.js`)
```javascript
const client = new API({
    mongoose: "mongodb+srv://username:password@cluster.mongodb.net/ownercord",
    port: 8080,
    redirect: "http://your-domain.com:8080/callback",
    ownercord_invite: "https://discord.gg/your-invite",
    token: "YOUR_API_BOT_TOKEN",
    routineWebhook: "YOUR_WEBHOOK_URL"
});
```

**Manager Configuration** (`Manager/OwnerCord-Manager.js`)
```javascript
const client = new Core({
    CoreToken: "YOUR_MANAGER_BOT_TOKEN",
    CoreID: "YOUR_MANAGER_BOT_ID",
    CorePort: 8080,
    CoreRedirect: "http://your-domain.com:8080/callback",
    CoreDevelopers: ["YOUR_DISCORD_USER_ID"],
    CoreMongoose: "mongodb+srv://username:password@cluster.mongodb.net/ownercord",
    CoreWebhooks: "YOUR_WEBHOOK_URL",
    CoreTitle: "OwnerCord"
});
```

#### Step 4: Discord Developer Portal Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application (or use existing)
3. Navigate to **OAuth2** section
4. Add redirect URI: `http://your-domain.com:8080/callback`
5. Navigate to **Bot** section
6. Enable required intents:
   - ✅ Presence Intent
   - ✅ Server Members Intent
   - ✅ Message Content Intent
7. Copy bot token for configuration

#### Step 5: Start the System

**Start API Server**
```bash
cd API
node index.js
# or use: start.bat
```

**Start Manager Bot**
```bash
cd Manager
node OwnerCord-Manager.js
# or use: start.bat
```

**Create Your First Bot**

Use the Manager bot in Discord:
```
/bot create id:YOUR_BOT_ID token:YOUR_BOT_TOKEN
```

The bot will automatically start via PM2!

---

## ⚙️ Configuration

### MongoDB Connection

All modules must use the same MongoDB connection string:

```javascript
mongoose: "mongodb+srv://username:password@cluster.mongodb.net/ownercord?retryWrites=true&w=majority"
```

**MongoDB Atlas Setup:**
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user with read/write permissions
3. Whitelist your IP address (or use `0.0.0.0/0` for all IPs)
4. Get your connection string from the "Connect" button

### Discord OAuth2 Configuration

**Required OAuth2 Scopes:**
- `bot` - Add bot to servers
- `applications.commands` - Use slash commands
- `identify` - Get user information
- `guilds.join` - Add users to servers
- `email` - Access user email

**Required Bot Permissions:**
- Administrator (8) - Full server control

**Redirect URI Format:**
```
http://your-domain.com:8080/callback
https://your-domain.com:8080/callback  (for production with SSL)
```

### Webhook Configuration

Set up Discord webhooks for different log types:

```javascript
// Auth logs - User verification events
Log_Auth: "https://discord.com/api/webhooks/..."

// Command logs - Bot command usage
Log_Command: "https://discord.com/api/webhooks/..."

// Routine logs - System health checks
routineWebhook: "https://discord.com/api/webhooks/..."

// Bot creation logs - New bot additions
CoreWebhooks: "https://discord.com/api/webhooks/..."
```

### Port Configuration

Default port is `8080`. To change:

1. Update in `API/index.js`:
   ```javascript
   port: YOUR_PORT
   ```

2. Update in `Manager/OwnerCord-Manager.js`:
   ```javascript
   CorePort: YOUR_PORT
   ```

3. Update redirect URI in Discord Developer Portal

### PM2 Configuration (Production)

For production deployment with PM2:

```bash
# Install PM2 globally
npm install -g pm2

# Start API with PM2
pm2 start API/index.js --name "ownercord-api"

# Start Manager with PM2
pm2 start Manager/OwnerCord-Manager.js --name "ownercord-manager"

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
```

---

## 💻 Usage

### Starting the System

#### Development Mode

**Terminal 1 - API Server:**
```bash
cd API
node index.js
```

**Terminal 2 - Manager Bot:**
```bash
cd Manager
node OwnerCord-Manager.js
```

#### Production Mode (with PM2)

```bash
# Start all services
pm2 start API/index.js --name "ownercord-api"
pm2 start Manager/OwnerCord-Manager.js --name "ownercord-manager"

# Monitor services
pm2 monit

# View logs
pm2 logs

# Restart services
pm2 restart all
```

### Creating Your First Bot

1. **Invite Manager Bot** to your Discord server
2. **Run the create command:**
   ```
   /bot create id:123456789 token:YOUR_BOT_TOKEN
   ```
3. **Configure the bot:**
   ```
   /bot secret key:YOUR_CLIENT_SECRET
   ```
4. **Set up verification:**
   ```
   /bot verify
   ```
   Select verification type from the menu

5. **Test OAuth flow:**
   Click the verification button and authorize

### Setting Up Features

#### Auto-Joiner
Automatically add verified users to your server:
```
/features joiner guild:YourServerName force_member:true
```

#### Auto-Role
Assign roles to verified users:
```
/features roles guild:YourServerName
```
Then select the role from the dropdown menu

#### Auto-Message
Send DM to verified users:
```
/features message message:Welcome to our server!
```

### Managing OAuth Sessions

**View all OAuth sessions:**
```
/oauth list
```

**Check specific user:**
```
/oauth info user:@username
```

**Delete OAuth session:**
```
/oauth delete user:@username
```

### Bot Status Configuration

**Set custom status:**
```
/bot state name:Playing with -username- status:online
```

Status options: `online`, `idle`, `dnd`, `invisible`

### Webhook Logging

**Configure auth logs:**
```
/bot webhook type:Auth url:YOUR_WEBHOOK_URL
```

**Configure command logs:**
```
/bot webhook type:Command url:YOUR_WEBHOOK_URL
```

---

## 📝 Commands

### Manager Bot Commands

| Command | Description | Permission |
|---------|-------------|------------|
| `/bot create <id> <token>` | Create and register a new bot in the system | Admin |
| `/panel` | Open the interactive management panel | Admin |

### Client Bot Commands

#### 🤖 Bot Configuration

| Command | Options | Description |
|---------|---------|-------------|
| `/bot secret` | `key:<client_secret>` | Set OAuth2 client secret |
| `/bot verify` | - | Display verification message menu |
| `/bot state` | `name:<status>` `status:<online/dnd/idle/invisible>` | Set bot status and activity |
| `/bot webhook` | `type:<Auth/Command>` `url:<webhook_url>` | Configure logging webhooks |
| `/bot about` | - | Display bot information and statistics |

#### 🎯 Feature Management

| Command | Options | Description | Plan |
|---------|---------|-------------|------|
| `/features joiner` | `guild:<server>` `force_member:<true/false>` | Configure auto-join feature | VIP+ |
| `/features message` | `message:<text>` | Set auto-DM message | VIP+ |
| `/features roles` | `guild:<server>` | Configure auto-role assignment | VIP+ |
| `/features info` | - | Display active features | All |
| `/features reset` | `feature:<Joiner/Roles/Message>` | Reset specific feature | All |

#### 📋 Whitelist Management

| Command | Options | Description |
|---------|---------|-------------|
| `/whitelist add` | `guild:<server_id>` | Add server to whitelist |
| `/whitelist remove` | `guild:<server_id>` | Remove server from whitelist |
| `/whitelist list` | - | View whitelisted servers |

#### 🔑 OAuth Management

| Command | Options | Description |
|---------|---------|-------------|
| `/oauth list` | - | List all OAuth sessions |
| `/oauth info` | `user:<@user>` | View user's OAuth details |
| `/oauth delete` | `user:<@user>` | Delete user's OAuth session |

#### 🔐 Authorization

| Command | Options | Description |
|---------|---------|-------------|
| `/authorise add` | `guild:<server_id>` | Authorize server for bot usage |
| `/authorise remove` | `guild:<server_id>` | Remove server authorization |
| `/authorise list` | - | View authorized servers |

#### 🔄 Switch System

| Command | Description |
|---------|-------------|
| `/switch` | Generate switch key for bot recovery |

### Command Examples

**Create a new bot:**
```
/bot create id:987654321 token:MTk4NzY1NDMyMQ.GH3pQl...
```

**Set up verification:**
```
/bot verify
→ Select "Normal Verify" from menu
```

**Configure auto-join with force member:**
```
/features joiner guild:My Server force_member:true
```

**Assign role to verified users:**
```
/features roles guild:My Server
→ Select "Member" role from dropdown
```

**Send welcome message:**
```
/features message message:Thanks for verifying! Enjoy your stay.
```

**View bot statistics:**
```
/bot about
```

---

## 💎 Pricing Plans

<table>
<tr>
<td width="33%" align="center">

### 🆓 Free Plan
**Tier 0**

**Perfect for testing**

</td>
<td width="33%" align="center">

### ⭐ VIP Plan
**Tier 1**

**For growing communities**

</td>
<td width="33%" align="center">

### 👑 Premium Plan
**Tier 2**

**Maximum control**

</td>
</tr>
<tr>
<td valign="top">

**Features:**
- ✅ Basic OAuth2 authentication
- ✅ Normal verification messages
- ✅ Bot management
- ✅ Whitelist system
- ✅ OAuth tracking
- ✅ Basic logging
- ❌ Premium verify types
- ❌ Auto-joiner
- ❌ Auto-role
- ❌ Auto-message
- ❌ Force member

</td>
<td valign="top">

**Everything in Free, plus:**
- ✅ All verification types
  - 🔞 Nude Verify
  - 🔥 NSFW Verify
  - 💎 Nitro Verify
- ✅ Auto-Joiner feature
- ✅ Auto-Role assignment
- ✅ Auto-Message DMs
- ✅ Advanced logging
- ✅ Priority support
- ❌ Force member

</td>
<td valign="top">

**Everything in VIP, plus:**
- ✅ Force Member feature
- ✅ Member retention control
- ✅ Advanced analytics
- ✅ Custom branding
- ✅ Dedicated support
- ✅ Early access to features
- ✅ Custom integrations
- ✅ SLA guarantee

</td>
</tr>
<tr>
<td align="center">

**$0/month**

</td>
<td align="center">

**Contact for pricing**

</td>
<td align="center">

**Contact for pricing**

</td>
</tr>
</table>

### Feature Comparison

| Feature | Free | VIP | Premium |
|---------|:----:|:---:|:-------:|
| OAuth2 Authentication | ✅ | ✅ | ✅ |
| Normal Verify | ✅ | ✅ | ✅ |
| Premium Verify Types | ❌ | ✅ | ✅ |
| Auto-Joiner | ❌ | ✅ | ✅ |
| Auto-Role | ❌ | ✅ | ✅ |
| Auto-Message | ❌ | ✅ | ✅ |
| Force Member | ❌ | ❌ | ✅ |
| Whitelist System | ✅ | ✅ | ✅ |
| Webhook Logging | Basic | Advanced | Advanced |
| Support | Community | Priority | Dedicated |
| Bot Limit | 1 | 5 | Unlimited |

---

## 🛠 Tech Stack

### Backend Technologies

<table>
<tr>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="48" height="48" alt="Node.js"/>
<br><strong>Node.js</strong>
<br><sub>Runtime Environment</sub>
</td>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="48" height="48" alt="JavaScript"/>
<br><strong>JavaScript</strong>
<br><sub>Programming Language</sub>
</td>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" width="48" height="48" alt="Express.js"/>
<br><strong>Express.js</strong>
<br><sub>Web Framework</sub>
</td>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" width="48" height="48" alt="MongoDB"/>
<br><strong>MongoDB</strong>
<br><sub>Database</sub>
</td>
<td align="center" width="20%">
<img src="https://discord.js.org/static/logo.svg" width="48" height="48" alt="Discord.js"/>
<br><strong>Discord.js</strong>
<br><sub>v14.13.0</sub>
</td>
</tr>
</table>

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| **discord.js** | ^14.13.0 | Discord API wrapper and bot framework |
| **express** | ^4.18.2 | Web server for OAuth2 callbacks |
| **mongoose** | ^8.0.3 | MongoDB object modeling |
| **axios** | ^1.6.2 | HTTP client for API requests |
| **ejs** | ^3.1.9 | Template engine for verification pages |
| **cron** | ^3.1.7 | Scheduled task management |
| **moment** | ^2.30.1 | Date and time manipulation |
| **colors** | ^1.4.0 | Terminal output styling |
| **node-fetch** | ^2.6.7 | Fetch API for Node.js |
| **request-ip** | ^3.3.0 | IP address extraction |
| **ip-locale** | ^1.0.3 | Geolocation from IP |
| **randomstring** | ^1.3.0 | Secure random string generation |

### Infrastructure

- **PM2** - Production process manager
- **MongoDB Atlas** - Cloud database hosting
- **Discord OAuth2** - Authentication provider
- **Webhook Integration** - Real-time logging

### Frontend

- **HTML5** - Markup language
- **CSS3** - Styling with custom design
- **Vanilla JavaScript** - Client-side interactivity
- **EJS Templates** - Server-side rendering
- **Responsive Design** - Mobile-friendly interface

---

## 📁 Database Schema

### Collections Overview

```javascript
OwnerCord Database
├── OwnerCord_Bots      // Bot configurations
├── OwnerCord_Auths     // OAuth sessions
├── OwnerCord_Logs      // System logs
└── OwnerCord_Manager   // Manager settings
```

### OwnerCord_Bots

Stores bot configuration and settings.

```javascript
{
  id: String,              // Discord bot ID (unique)
  Token: String,           // Bot authentication token
  Secret: String,          // OAuth2 client secret
  Owner: String,           // Discord user ID of bot owner
  Status: {                // Bot presence configuration
    name: String,          // Activity name
    status: String         // online/dnd/idle/invisible
  },
  type: String,            // Plan tier: "0" (Free), "1" (VIP), "2" (Premium)
  Features: [              // Array of enabled features
    {
      Joiner: {
        guild: String,     // Target guild ID for auto-join
        force_member: Boolean  // Force member retention (Premium only)
      }
    },
    {
      Roles: {
        guild: String,     // Target guild ID for auto-role
        role: String       // Role ID to assign
      }
    },
    {
      Message: {
        message: String    // Auto-DM message content
      }
    }
  ],
  Log_Auth: String,        // Webhook URL for auth logs
  Log_Command: String,     // Webhook URL for command logs
  Whitelist: [String],     // Array of whitelisted guild IDs
  Authorized: [String],    // Array of authorized guild IDs
  createdAt: Date,         // Bot creation timestamp
  updatedAt: Date          // Last update timestamp
}
```

### OwnerCord_Auths

Stores OAuth2 authentication sessions.

```javascript
{
  id: String,              // Discord user ID (unique per bot+guild)
  bot: String,             // Bot ID that processed the auth
  guild: String,           // Guild ID where auth occurred
  access_token: String,    // OAuth2 access token
  refresh_token: String,   // OAuth2 refresh token
  token_type: String,      // Token type (usually "Bearer")
  expires_in: Number,      // Token expiration time in seconds
  scope: String,           // OAuth2 scopes granted
  email: String,           // User's email address
  username: String,        // Discord username
  discriminator: String,   // Discord discriminator
  avatar: String,          // Avatar hash
  locale: String,          // User's locale (e.g., "en-US")
  ip: String,              // IP address of the user
  country: String,         // Country from IP geolocation
  date: Date,              // Authentication timestamp
  lastRefresh: Date        // Last token refresh timestamp
}
```

### OwnerCord_Logs

Stores system activity logs.

```javascript
{
  type: String,            // Log type: "auth", "command", "error", "system"
  bot: String,             // Bot ID related to the log
  user: String,            // User ID (if applicable)
  guild: String,           // Guild ID (if applicable)
  action: String,          // Action performed
  details: Object,         // Additional log details
  ip: String,              // IP address (if applicable)
  timestamp: Date          // Log creation time
}
```

### OwnerCord_Manager

Stores manager bot configuration.

```javascript
{
  id: String,              // Manager bot ID
  developers: [String],    // Array of developer user IDs
  settings: {
    maintenance: Boolean,  // Maintenance mode flag
    maxBots: Number,       // Maximum bots per user
    defaultPlan: String    // Default plan for new bots
  },
  statistics: {
    totalBots: Number,     // Total bots created
    totalAuths: Number,    // Total OAuth sessions
    totalUsers: Number     // Total unique users
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes

For optimal performance, create these indexes:

```javascript
// OwnerCord_Bots
db.OwnerCord_Bots.createIndex({ id: 1 }, { unique: true })
db.OwnerCord_Bots.createIndex({ Owner: 1 })
db.OwnerCord_Bots.createIndex({ type: 1 })

// OwnerCord_Auths
db.OwnerCord_Auths.createIndex({ id: 1, bot: 1, guild: 1 }, { unique: true })
db.OwnerCord_Auths.createIndex({ bot: 1 })
db.OwnerCord_Auths.createIndex({ guild: 1 })
db.OwnerCord_Auths.createIndex({ date: -1 })

// OwnerCord_Logs
db.OwnerCord_Logs.createIndex({ timestamp: -1 })
db.OwnerCord_Logs.createIndex({ type: 1, timestamp: -1 })
db.OwnerCord_Logs.createIndex({ bot: 1, timestamp: -1 })
```

---

## 🔒 Security

OwnerCord implements multiple security layers to protect user data and system integrity.

### Authentication & Authorization

- **OAuth2 Protocol**: Industry-standard authentication
- **Token Encryption**: Secure storage of access and refresh tokens
- **JWT Validation**: Token verification on each request
- **Role-Based Access**: Developer, owner, and user permission levels
- **Switch Key System**: Secure bot recovery mechanism

### Data Protection

- **MongoDB Security**: 
  - Connection string encryption
  - Database user authentication
  - IP whitelist configuration
  - Encrypted connections (TLS/SSL)

- **Input Validation**:
  - Sanitization of user inputs
  - MongoDB injection prevention
  - XSS protection
  - CSRF token validation

- **Sensitive Data Handling**:
  - Bot tokens stored securely
  - Client secrets encrypted
  - User emails protected
  - IP addresses anonymized in logs

### Network Security

- **Rate Limiting**: Prevent abuse and DDoS attacks (recommended)
- **IP Tracking**: Monitor and log connection sources
- **Webhook Validation**: Verify Discord webhook authenticity
- **HTTPS Support**: SSL/TLS encryption for production

### Best Practices

#### For Developers

```javascript
// ❌ DON'T: Hardcode credentials
const token = "MTk4NzY1NDMyMQ.GH3pQl...";

// ✅ DO: Use environment variables
const token = process.env.BOT_TOKEN;
```

#### For Production

1. **Use Environment Variables**:
   ```bash
   export MONGODB_URI="mongodb+srv://..."
   export BOT_TOKEN="..."
   export CLIENT_SECRET="..."
   ```

2. **Enable HTTPS**:
   - Use reverse proxy (nginx, Apache)
   - Obtain SSL certificate (Let's Encrypt)
   - Update redirect URIs to HTTPS

3. **Implement Rate Limiting**:
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use('/callback', limiter);
   ```

4. **Regular Security Audits**:
   ```bash
   npm audit
   npm audit fix
   ```

5. **Keep Dependencies Updated**:
   ```bash
   npm update
   npm outdated
   ```

### Security Checklist

- [ ] MongoDB connection uses authentication
- [ ] Bot tokens stored in environment variables
- [ ] HTTPS enabled for production
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] Webhook URLs kept private
- [ ] Regular dependency updates
- [ ] Error messages don't expose sensitive data
- [ ] Logs don't contain tokens or secrets
- [ ] IP whitelist configured for MongoDB

### Reporting Security Issues

If you discover a security vulnerability, please email security@ownercord.com instead of using the issue tracker.

---

## 🤝 Contributing

We welcome contributions from the community! Whether it's bug fixes, new features, or documentation improvements, your help is appreciated.

### How to Contribute

1. **Fork the Repository**
   ```bash
   # Click the "Fork" button on GitHub
   git clone https://github.com/YOUR_USERNAME/ownercord.git
   cd ownercord
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   # or
   git checkout -b fix/bug-fix
   ```

3. **Make Your Changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Test your changes thoroughly

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: Add amazing feature"
   ```

   **Commit Message Convention:**
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting)
   - `refactor:` Code refactoring
   - `test:` Adding tests
   - `chore:` Maintenance tasks

5. **Push to Your Fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Describe your changes clearly

### Development Guidelines

#### Code Style

- Use **camelCase** for variables and functions
- Use **PascalCase** for classes
- Use **UPPER_CASE** for constants
- Indent with **2 spaces**
- Use **semicolons**
- Add **JSDoc comments** for functions

Example:
```javascript
/**
 * Fetches user OAuth data from database
 * @param {string} userId - Discord user ID
 * @param {string} botId - Bot ID
 * @returns {Promise<Object>} OAuth data object
 */
async function fetchUserAuth(userId, botId) {
  const auth = await Auths.findOne({ id: userId, bot: botId });
  return auth;
}
```

#### Testing

Before submitting a PR:
- [ ] Test all new features
- [ ] Verify existing features still work
- [ ] Check for console errors
- [ ] Test with different plan tiers
- [ ] Validate database operations

#### Documentation

- Update README.md if adding new features
- Add inline comments for complex code
- Document new commands
- Update configuration examples

### Areas for Contribution

We're especially interested in contributions for:

- 🐛 **Bug Fixes**: Fix reported issues
- ✨ **New Features**: Add requested features
- 📚 **Documentation**: Improve guides and examples
- 🎨 **UI/UX**: Enhance verification pages
- 🔒 **Security**: Improve security measures
- ⚡ **Performance**: Optimize code and queries
- 🌍 **Localization**: Add language support
- 🧪 **Testing**: Add unit and integration tests

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow the project's coding standards
- Report security issues privately

### Getting Help

- 💬 **Discord**: Join our [community server](https://discord.gg/ininal)
- 📧 **Email**: contact@rowycik.me
- 📖 **Documentation**: Check the README and code comments
- 🐛 **Issues**: Search existing issues before creating new ones

---

## 📄 License

This project is licensed under the **ISC License**.

```
ISC License

Copyright (c) 2024 OwnerCord

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

See the [LICENSE](LICENSE) file for full details.

---

## 📞 Support

### Community Support

<table>
<tr>
<td align="center" width="33%">

### 💬 Discord
Join our community server for help, updates, and discussions.

[![Discord](https://img.shields.io/badge/Discord-Join%20Server-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/ininal)

</td>
<td align="center" width="33%">

### 📺 YouTube
Watch tutorials and feature showcases.

[![YouTube](https://img.shields.io/badge/YouTube-Subscribe-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](http://youtube.com/RowyHere)

</td>
<td align="center" width="33%">

### 🐛 Issues
Report bugs and request features.

[![GitHub Issues](https://img.shields.io/badge/GitHub-Issues-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yourusername/ownercord/issues)

</td>
</tr>
</table>

### Contact Information

- **Email**: contact@rowycik.me
- **Discord**: [OwnerCord Community](https://discord.gg/ininal)
- **YouTube**: [RowyHere](http://youtube.com/RowyHere)
- 
---

## ⚠️ Disclaimer

**Important Notice:**

This project is provided for **educational and development purposes**. Users are solely responsible for ensuring their use of this software complies with:

- Discord's [Terms of Service](https://discord.com/terms)
- Discord's [Community Guidelines](https://discord.com/guidelines)
- Discord's [Developer Terms of Service](https://discord.com/developers/docs/policies-and-agreements/developer-terms-of-service)
- Discord's [Developer Policy](https://discord.com/developers/docs/policies-and-agreements/developer-policy)

**The developers and contributors of OwnerCord:**
- Do not endorse or encourage any violation of Discord's policies
- Are not responsible for misuse of this software
- Provide no warranty or guarantee of any kind
- Are not liable for any damages resulting from use of this software

**Use at your own risk.** Misuse of Discord's API or violation of their terms may result in account termination or legal action by Discord Inc.

---

## 🌟 Acknowledgments

Special thanks to:

- **Discord.js** team for the amazing library
- **MongoDB** for reliable database services
- **PM2** for process management
- All contributors and community members
- Open-source community for inspiration

---

<div align="center">

## 💖 Made with Love by Rowy (OwnerCord Dev. Leader)

**If you find this project useful, please consider:**

[![Star on GitHub](https://img.shields.io/github/stars/RowyHere/discord-ownercord-oauths?style=social)](https://github.com/RowyHere/discord-ownercord-oauths)
[![Fork on GitHub](https://img.shields.io/github/forks/RowyHere/discord-ownercord-oauths?style=social)](https://github.com/RowyHere/discord-ownercord-oauths/fork)
[![Watch on GitHub](https://img.shields.io/github/watchers/RowyHere/discord-ownercord-oauths?style=social)](https://github.com/RowyHere/discord-ownercord-oauths)

### ⭐ Star this repository if you found it helpful!

---

**© 2026 OwnerCord. All rights reserved.**

[Back to Top](#-ownercord)

</div>
