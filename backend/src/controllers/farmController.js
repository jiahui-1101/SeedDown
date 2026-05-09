/**
 * farmController.js
 *
 * POST /api/farms/scan-plants   — Claude Vision plant recognition
 * POST /api/farms/generate-3d   — Proxy to DA3 depth service for .glb mesh
 * POST /api/farms/create        — Persist new farm to Firestore (or local fallback)
 *
 * Env vars:
 * CLAUDE_API_KEY  — Anthropic API key for Vision calls
 * DA3_SERVICE_URL — URL of the DA3 backend service
 */

const fetch = (...args) =>
    import('node-fetch').then(({ default: f }) => f(...args));

// ─────────────────────────────────────────────────────────────
// Scan Plants (Claude Vision)
// ─────────────────────────────────────────────────────────────
async function scanPlants(req, res) {
    const { image, mediaType } = req.body;

    if (!image) {
        return res.status(400).json({
            error: 'No image provided',
            plants: [],
        });
    }

    const claudeKey = process.env.CLAUDE_API_KEY;

    if (!claudeKey) {
        console.warn('[farmController] CLAUDE_API_KEY not set');

        return res.json({
            plants: [],
            warning: 'Set CLAUDE_API_KEY in .env to enable AI plant recognition',
        });
    }

    try {
        const response = await fetch(
            'https://api.anthropic.com/v1/messages',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': claudeKey,
                    'anthropic-version': '2023-06-01',
                },
                body: JSON.stringify({
                    model: 'claude-3-5-sonnet-20241022',
                    max_tokens: 900,
                    messages: [
                        {
                            role: 'user',
                            content: [
                                {
                                    type: 'image',
                                    source: {
                                        type: 'base64',
                                        media_type: mediaType || 'image/jpeg',
                                        data: image,
                                    },
                                },
                                {
                                    type: 'text',
                                    text: `
You are a vertical farm expert. Analyse this indoor/vertical farm photo.

Identify every plant species you can see and estimate how many slots/pots each occupies.

Return ONLY valid JSON, no markdown fences, no preamble:

{
  "plants": [
    {
      "name": "Common Name",
      "emoji": "🥬",
      "species": "species_slug",
      "confidence": 0.92,
      "slots": 4
    }
  ]
}

Rules:
- confidence: 0.0–1.0
- slots: integer, estimated pot/slot count for this species visible
- species: lowercase, underscores for spaces
- use realistic vegetable / herb emojis
- if photo is unclear or no plants visible, return {"plants":[]}
- do NOT wrap in markdown
- return raw JSON only
                                    `,
                                },
                            ],
                        },
                    ],
                }),
            }
        );

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message || 'Claude API error');
        }

        const rawText = data.content?.[0]?.text || '{"plants":[]}';

        const cleaned = rawText
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

        const parsed = JSON.parse(cleaned);

        // Validate + sanitize
        parsed.plants = (parsed.plants || []).map((p) => ({
            name: p.name || 'Unknown Plant',
            emoji: p.emoji || '🌱',
            species: (p.species || 'unknown')
                .toLowerCase()
                .replace(/\s+/g, '_'),
            confidence: Math.min(
                1,
                Math.max(0, parseFloat(p.confidence) || 0)
            ),
            slots: Math.max(
                1,
                Math.min(50, parseInt(p.slots) || 3)
            ),
        }));

        return res.json(parsed);
    } catch (err) {
        console.error('[farmController] scanPlants error:', err.message);

        return res.status(500).json({
            error: err.message,
            plants: [],
        });
    }
}

// ─────────────────────────────────────────────────────────────
// Generate 3D (DA3 Proxy)
// ─────────────────────────────────────────────────────────────
async function generate3D(req, res) {
    const { image, mediaType } = req.body;

    if (!image) {
        return res.status(400).json({
            error: 'No image provided',
        });
    }

    const DA3_URL =
        process.env.DA3_SERVICE_URL || 'http://localhost:8008';

    // Check DA3 service status
    try {
        const controller = new AbortController();

        setTimeout(() => controller.abort(), 3000);

        const statusRes = await fetch(`${DA3_URL}/status`, {
            signal: controller.signal,
        });

        if (!statusRes.ok) {
            throw new Error('DA3 unhealthy');
        }
    } catch (err) {
        return res.status(503).json({
            error: 'DA3 service not reachable',
            hint: [
                'Install: pip install depth-anything-3',
                'Start: da3 backend --model-dir depth-anything/DA3NESTED-GIANT-LARGE-1.1 --port 8008',
                'License: CC BY-NC 4.0 (non-commercial only)',
            ].join('\n'),
        });
    }

    try {
        // Convert base64 to buffer
        const imgBuffer = Buffer.from(image, 'base64');

        // Build multipart form manually
        const boundary = `----NLFBoundary${Date.now()}`;

        const parts = [
            `--${boundary}\r\n`,
            `Content-Disposition: form-data; name="image"; filename="farm.jpg"\r\n`,
            `Content-Type: ${mediaType || 'image/jpeg'}\r\n\r\n`,
        ];

        const partsAfter = [
            `\r\n--${boundary}\r\n`,
            `Content-Disposition: form-data; name="export_format"\r\n\r\nglb`,
            `\r\n--${boundary}--\r\n`,
        ];

        const preamble = Buffer.from(parts.join(''), 'utf8');
        const postamble = Buffer.from(partsAfter.join(''), 'utf8');

        const body = Buffer.concat([
            preamble,
            imgBuffer,
            postamble,
        ]);

        const controller = new AbortController();

        setTimeout(() => controller.abort(), 90000);

        const inferRes = await fetch(`${DA3_URL}/infer`, {
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': body.length.toString(),
            },
            body,
            signal: controller.signal,
        });

        if (!inferRes.ok) {
            const txt = await inferRes.text();

            throw new Error(
                `DA3 inference failed: ${inferRes.status} — ${txt}`
            );
        }

        const arrayBuf = await inferRes.arrayBuffer();

        const glbBuffer = Buffer.from(arrayBuf);

        res.set({
            'Content-Type': 'model/gltf-binary',
            'Content-Disposition':
                'inline; filename="farm_3d.glb"',
            'Content-Length': glbBuffer.length,
        });

        return res.send(glbBuffer);
    } catch (err) {
        console.error(
            '[farmController] generate3D error:',
            err.message
        );

        return res.status(500).json({
            error: err.message,
        });
    }
}

// ─────────────────────────────────────────────────────────────
// Create Farm
// ─────────────────────────────────────────────────────────────
async function createFarm(req, res) {
    const {
        name,
        location,
        rackType,
        plants,
        targetPlant,
        analysisGoal,
        viewMode,
        photoPreview,
    } = req.body;

    if (!name) {
        return res.status(400).json({
            error: 'Farm name required',
        });
    }

    const farmDoc = {
        name: name.trim(),
        location: location || '',
        rackType: rackType || '3-tier',
        plants: plants || [],
        targetPlant: targetPlant || '',
        analysisGoal: analysisGoal || 'yield',
        viewMode: viewMode || 'realistic',
        hasPhoto: Boolean(photoPreview),
        status: 'active',
        createdAt: new Date().toISOString(),
    };

    // Try Firestore
    try {
        const { getDb } = require('../config/db');
        const docRef = await getDb()
            .collection('farms')
            .add(farmDoc);

        return res.json({
            success: true,
            farmId: docRef.id,
            farm: farmDoc,
        });
    } catch (err) {
        console.warn(
            '[farmController] Firestore save skipped:',
            err.message
        );
    }

    // Local fallback
    return res.json({
        success: true,
        farmId: `local_${Date.now()}`,
        farm: farmDoc,
    });
}

module.exports = {
    scanPlants,
    generate3D,
    createFarm,
};
