// server.js
// Express server for CyberArena cybersecurity dashboard backend

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.static(__dirname));
// ================================================================
// MOCK DATA
// ================================================================

// Mock user profile
const userProfile = {
  username: 'Devaanshi',
  role: 'Cybersecurity Student',
  currentXP: 12450,
  level: 24,
  labsCompleted: 47,
  challengesSolved: 89,
  securityScore: 94,
};

// Mock SOC incidents
const mockIncidents = [
  {
    id: 1,
    title: 'Brute-Force Threat',
    severity: 'High',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    source: '10.0.1.45',
    status: 'active',
    description: 'Multiple failed SSH login attempts from external IP.',
  },
  {
    id: 2,
    title: 'Suspicious API Leak',
    severity: 'Critical',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    source: 'api-gateway',
    status: 'investigating',
    description: 'Unusual outbound API payload size indicating possible data exfiltration.',
  },
  {
    id: 3,
    title: 'Malware Signature Detected',
    severity: 'Medium',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
    source: 'endpoint-02',
    status: 'resolved',
    description: 'Known ransomware signature triggered on workstation.',
  },
  {
    id: 4,
    title: 'Privilege Escalation Attempt',
    severity: 'High',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    source: 'auth-service',
    status: 'active',
    description: 'User attempted to gain admin privileges via sudo abuse.',
  },
  {
    id: 5,
    title: 'Phishing Campaign Detected',
    severity: 'Medium',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    source: 'email-gateway',
    status: 'contained',
    description: 'Mass phishing emails impersonating internal IT.',
  },
];

// ================================================================
// API ROUTES
// ================================================================

/**
 * GET /api/user/profile
 * Returns the mock user profile data.
 */
app.get('/api/user/profile', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: userProfile,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * POST /api/crypto/encrypt
 * Simulates AES-256-GCM encryption of the provided plaintext.
 * Request body: { plaintext: string }
 * Returns: { ciphertext, iv, authTag, algorithm }
 */
app.post('/api/crypto/encrypt', (req, res) => {
  try {
    const plaintext = req.body.plaintext || req.body.text;

    if (!plaintext || typeof plaintext !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Missing or invalid "plaintext" field. Must be a non-empty string.',
      });
    }

    // Generate a random 256-bit key and 96-bit IV for AES-256-GCM
    const key = crypto.randomBytes(32); // 32 bytes = 256 bits
    const iv = crypto.randomBytes(12); // 12 bytes = 96 bits (recommended for GCM)

    // Create cipher
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    // Encrypt the plaintext (as UTF-8)
    let encrypted = cipher.update(plaintext, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    // Get the authentication tag (16 bytes)
    const authTag = cipher.getAuthTag();

    // Return the encrypted data along with the IV and auth tag (as base64)
    res.status(200).json({
      success: true,
      algorithm: 'AES-256-GCM',
      ciphertext: encrypted,
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64'),
      // In a real implementation, you would also return the key (or derive it)
      // but we omit it here for simulation; the client would need it to decrypt.
    });
  } catch (error) {
    console.error('Encryption error:', error);
    res.status(500).json({ success: false, message: 'Encryption failed' });
  }
});

/**
 * GET /api/soc/incidents
 * Returns the mock list of security incidents.
 * Optionally supports query parameter ?limit=n to limit results.
 */
app.get('/api/soc/incidents', (req, res) => {
  try {
    let incidents = [...mockIncidents];

    // Optional limit query parameter
    const limit = parseInt(req.query.limit, 10);
    if (!isNaN(limit) && limit > 0) {
      incidents = incidents.slice(0, limit);
    }

    res.status(200).json({
      success: true,
      count: incidents.length,
      data: incidents,
    });
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * Root endpoint – health check
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ================================================================
// START SERVER
// ================================================================

app.listen(PORT, () => {
  console.log(`✅ CyberArena backend server running on port ${PORT}`);
  console.log(`📍 API base URL: http://localhost:${PORT}`);
});

// Export for testing (optional)
module.exports = app;
