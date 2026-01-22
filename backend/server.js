const app = require('./app');
const config = require('./src/config');

const PORT = config.port;

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Soeltan Medsos Backend Server                        ║
║                                                           ║
║   Server running on: http://localhost:${PORT}               ║
║   Environment: ${config.nodeEnv.padEnd(40)}║
║                                                           ║
║   API Endpoints:                                          ║
║   - Public:  http://localhost:${PORT}/api                   ║
║   - Admin:   http://localhost:${PORT}/api/admin             ║
║   - Webhook: http://localhost:${PORT}/api/midtrans/webhook  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
