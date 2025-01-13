const { Server } = require('socket.io');
const http = require('http');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3003;
const server = http.createServer();

// Function to find the latest session folder
function findLatestSessionFolder() {
  const monitorPath = path.join(__dirname, '../monitor');
  const sessionFolders = fs.readdirSync(monitorPath)
    .filter(folder => folder.toLowerCase().includes('session'))
    .map(folder => ({
      path: folder,
      date: new Date(folder.split('-')[0].trim())
    }))
    .sort((a, b) => {
      // First sort by date
      const dateCompare = b.date - a.date;
      if (dateCompare !== 0) return dateCompare;
      
      // If same date, sort by session number
      const aSession = parseInt(a.path.split('Session')[1]) || 0;
      const bSession = parseInt(b.path.split('Session')[1]) || 0;
      return bSession - aSession;
    });

  if (sessionFolders.length === 0) {
    throw new Error('No session folders found in monitor directory');
  }

  return path.join(monitorPath, sessionFolders[0].path, 'SCAN_RECORDS.db');
}

const DB_PATH = findLatestSessionFolder();

// Initialize database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  }
  console.log('📁 Connected to database:', DB_PATH);
});

// Function to fetch tokens from database
function fetchTokens() {
  return new Promise((resolve, reject) => {
    // First, let's check if the table exists and get its structure
    db.all(`SELECT * FROM sqlite_master WHERE type='table' AND name='scan_records'`, [], (err, tables) => {
      if (err) {
        console.error('❌ Error checking table structure:', err);
        return reject(err);
      }
      
      console.log('📊 Table structure:', tables[0]?.sql);
      
      // Now fetch the records with the correct columns
      db.all(`
        SELECT *
        FROM scan_records 
        ORDER BY scan_timestamp DESC 
        LIMIT 100
      `, [], (err, rows) => {
        if (err) {
          console.error('❌ Error fetching tokens:', err);
          return reject(err);
        }
        
        console.log('📝 Sample row:', rows[0]);
        
        const tokens = rows.map(row => {
          try {
            return {
              // Basic Token Info
              address: row.token_address,
              name: row.token_name || 'Unknown',
              symbol: row.token_symbol || 'UNKNOWN',
              decimals: row.token_decimals || 18,
              totalSupply: row.token_total_supply || '0',
              creationTime: new Date(row.hp_creation_time).getTime() / 1000 || Math.floor(Date.now() / 1000) - Math.floor((row.token_age_hours || 0) * 3600),
              ageHours: row.token_age_hours || 0,
              
              // Pair Info
              pairAddress: row.pair_address,
              baseTokenSymbol: row.hp_pair_token1_symbol,
              pairAgeHours: row.token_age_hours || 0,
              reservesToken0: row.hp_pair_reserves0,
              reservesToken1: row.hp_pair_reserves1,
              
              // Honeypot Analysis
              isHoneypot: row.hp_is_honeypot === 1,
              simulationSuccess: row.hp_simulation_success === 1,
              riskLevel: 'TODO',  // Calculate based on various factors
              riskType: row.hp_honeypot_reason || 'None',
              simulationError: row.last_error || null,
              honeypotReason: row.hp_honeypot_reason,
              honeypotFailures: row.honeypot_failures || 0,
              
              // Transaction Analysis
              buyGas: row.hp_buy_gas_used,
              sellGas: row.hp_sell_gas_used,
              buyTax: row.hp_buy_tax || 0,
              sellTax: row.hp_sell_tax || 0,
              transferTax: row.hp_transfer_tax || 0,
              
              // GoPlus Security
              gpIsOpenSource: row.gp_is_open_source === 1,
              gpIsProxy: row.gp_is_proxy === 1,
              gpIsMintable: row.gp_is_mintable === 1,
              gpExternalCall: row.gp_external_call === 1,
              gpSelfDestruct: row.gp_selfdestruct === 1,
              gpHiddenOwner: row.gp_hidden_owner === 1,
              gpOwnerAddress: row.gp_owner_address,
              gpOwnerBalance: row.gp_owner_balance,
              gpOwnerPercent: row.gp_owner_percent || 0,
              gpHolderCount: row.gp_holder_count || 0,
              gpLpHolderCount: row.gp_lp_holder_count || 0,
              gpBuyTax: row.gp_buy_tax || 0,
              gpSellTax: row.gp_sell_tax || 0,
              gpTransferTax: row.gp_transfer_tax || 0,
              gpCannotBuy: row.gp_cannot_buy === 1,
              gpCannotSellAll: row.gp_cannot_sell_all === 1,
              gpTradingCooldown: row.gp_trading_cooldown === 1,
              gpIsAntiWhale: row.gp_is_anti_whale === 1,
              gpSlippageModifiable: row.gp_slippage_modifiable === 1,
              gpTransferPausable: row.gp_transfer_pausable === 1,
              gpIsBlacklisted: row.gp_is_blacklisted === 1,
              gpIsWhitelisted: row.gp_is_whitelisted === 1,
              gpTopHolderCount: 0, // TODO: Parse from gp_holders JSON
              gpTopHolderShare: 0, // TODO: Calculate from gp_holders
              gpLpTopHolderCount: 0, // TODO: Parse from gp_lp_holders JSON
              gpLpTopHolderShare: 0, // TODO: Calculate from gp_lp_holders
              
              // DEX Info
              gpDexInfo: row.gp_dex_info ? JSON.parse(row.gp_dex_info) : [],
              dex: 'Uniswap V2', // TODO: Extract from dex_info
              router: row.router_address,
              factory: row.factory_address,
              
              // Metadata
              totalScans: row.total_scans || 0,
              status: row.status || 'new',
              
              // Safety Score (TODO: Implement proper calculation)
              safetyScore: Math.floor(Math.random() * 100)
            };
          } catch (e) {
            console.error('❌ Error parsing row:', e, row);
            return null;
          }
        }).filter(Boolean);
        
        resolve(tokens);
      });
    });
  });
}

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"]
  }
});

// Store active connections
const connections = new Set();

// Store token list
let tokens = [];

// Initialize tokens
fetchTokens().then(dbTokens => {
  tokens = dbTokens;
  console.log(`📝 Loaded ${tokens.length} tokens from database`);
}).catch(err => {
  console.error('❌ Failed to load initial tokens:', err);
});

io.on('connection', (socket) => {
  console.log('👤 Client connected');
  connections.add(socket);

  socket.on('disconnect', () => {
    console.log('👋 Client disconnected');
    connections.delete(socket);
  });

  socket.on('PING', () => {
    socket.emit('PONG', { time: Date.now() });
    console.log('🏓 PING-PONG');
  });

  socket.on('get_tokens', () => {
    console.log('📋 Sending token list to client');
    socket.emit('token_list', tokens);
  });
});

// Simulate token updates by periodically refreshing from database
const updateInterval = setInterval(async () => {
  if (connections.size > 0) {
    try {
      const dbTokens = await fetchTokens();
      
      // Find new or updated tokens
      dbTokens.forEach(dbToken => {
        const existingToken = tokens.find(t => t.address === dbToken.address);
        if (!existingToken) {
          tokens.push(dbToken);
          io.emit('token_update', dbToken);
          console.log(`➕ Added new token ${dbToken.symbol}`);
        } else if (JSON.stringify(existingToken) !== JSON.stringify(dbToken)) {
          Object.assign(existingToken, dbToken);
          io.emit('token_update', dbToken);
          console.log(`🔄 Updated token ${dbToken.symbol}`);
        }
      });
      
      // Remove tokens that no longer exist in database
      tokens = tokens.filter(token => {
        const exists = dbTokens.some(dbToken => dbToken.address === token.address);
        if (!exists) {
          io.emit('token_remove', token.address);
          console.log(`➖ Removed token ${token.symbol}`);
        }
        return exists;
      });
      
    } catch (err) {
      console.error('❌ Error updating tokens:', err);
    }
  }
}, 2000);

// Cleanup on exit
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  clearInterval(updateInterval);
  db.close(() => {
    console.log('📁 Database connection closed');
    server.close(() => {
      console.log('👋 Server closed');
      process.exit(0);
    });
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`
🚀 Test server running on port ${PORT}
📁 Using database: ${DB_PATH}
⏱️  Update interval: 2000ms
🔌 WebSocket endpoint: ws://localhost:${PORT}
🌐 CORS origin: http://localhost:3000
  `);
}); 