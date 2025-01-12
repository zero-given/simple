const { Server } = require('socket.io');
const http = require('http');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const PORT = process.env.PORT || 3003;
const server = http.createServer();
const DB_PATH = path.join(__dirname, '../monitor/January 12 - Session 1/SCAN_RECORDS.db');

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
              address: row.token_address,
              name: row.name || 'Unknown',
              symbol: row.symbol || 'UNKNOWN',
              decimals: row.decimals || 18,
              totalSupply: row.total_supply || '0',
              creationTime: Math.floor(Date.now() / 1000) - Math.floor((row.age_hours || 0) * 3600),
              ageHours: row.age_hours || 0,
              isHoneypot: row.is_honeypot || false,
              gpIsOpenSource: row.is_open_source || false,
              gpIsProxy: row.is_proxy || false,
              gpIsMintable: row.is_mintable || false,
              gpBuyTax: row.buy_tax || 0,
              gpSellTax: row.sell_tax || 0,
              gpHolderCount: row.holder_count || 0,
              safetyScore: Math.floor(Math.random() * 100), // TODO: Calculate based on data
              honeypotFailures: row.honeypot_failures || 0,
              totalScans: row.total_scans || 0
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