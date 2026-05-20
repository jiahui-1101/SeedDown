/**
 * SeedDown - Sensor Test Script
 * 模拟 ESP32 发送 sensor 数据，然后验证 database 有没有存进去
 *
 * 用法: node test_sensor.js
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// ─── 模拟的 sensor 数据 (可以自己改) ────────────────────────────────
const sensorPayloads = [
  {
    label: '✅ 正常状态 (all good)',
    data: {
      deviceId: 'farm_001',
      temperature: 24.0,
      humidity: 60.0,
      gasRaw: 1200,       // 低于 2500 danger threshold → 安全
      soilRaw: 2500,      // 高于 1800 dry threshold → 够湿
      ph: 6.0,            // 在 5.5~6.5 范围内 → 正常
      lightRaw: 2000,     // 高于 1500 dark threshold → 够亮
      waterDistanceCm: 10.0,
      intervalSeconds: 3600,
    },
    expectedCommand: 'NO_ACTION',
  },
  {
    label: '💧 土壤太干 (soil dry)',
    data: {
      deviceId: 'farm_001',
      temperature: 25.0,
      humidity: 45.0,
      gasRaw: 1000,
      soilRaw: 900,       // 低于 1800 → 触发 WATER_ON
      ph: 6.1,
      lightRaw: 2000,
      waterDistanceCm: 10.0,
      intervalSeconds: 3600,
    },
    expectedCommand: 'WATER_ON',
  },
  {
    label: '🌑 光线不足 (dark)',
    data: {
      deviceId: 'farm_001',
      temperature: 22.0,
      humidity: 55.0,
      gasRaw: 1000,
      soilRaw: 2500,
      ph: 6.0,
      lightRaw: 500,      // 低于 1500 → 触发 LIGHT_ON
      waterDistanceCm: 10.0,
      intervalSeconds: 3600,
    },
    expectedCommand: 'LIGHT_ON',
  },
  {
    label: '☠️  气体危险 (gas danger)',
    data: {
      deviceId: 'farm_001',
      temperature: 26.0,
      humidity: 50.0,
      gasRaw: 3500,       // 高于 2500 → 触发 BUZZER_ON
      soilRaw: 2500,
      ph: 6.0,
      lightRaw: 2000,
      waterDistanceCm: 10.0,
      intervalSeconds: 3600,
    },
    expectedCommand: 'BUZZER_ON',
  },
  {
    label: '⚗️  pH 异常 (pH out of range)',
    data: {
      deviceId: 'farm_001',
      temperature: 23.0,
      humidity: 58.0,
      gasRaw: 1000,
      soilRaw: 2500,
      ph: 7.5,            // 超过 6.5 → 触发 PH_WARNING
      lightRaw: 2000,
      waterDistanceCm: 10.0,
      intervalSeconds: 3600,
    },
    expectedCommand: 'PH_WARNING',
  },
];

// ─── Helper: 颜色输出 ────────────────────────────────────────────────
const green  = (s) => `\x1b[32m${s}\x1b[0m`;
const red    = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const cyan   = (s) => `\x1b[36m${s}\x1b[0m`;
const bold   = (s) => `\x1b[1m${s}\x1b[0m`;

async function post(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.json() };
}

async function get(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  return { status: res.status, body: await res.json() };
}

// ─── Step 1: 检查 backend 是否在跑 ──────────────────────────────────
async function checkBackend() {
  console.log(bold('\n🔍 Step 1: 检查 backend 连接...'));
  try {
    const res = await fetch(`${BASE_URL}/`);
    const body = await res.json();
    console.log(green(`  ✅ Backend OK → ${body.status}`));
    return true;
  } catch (e) {
    console.log(red(`  ❌ Backend 连不上! 确保 backend 在跑: cd backend && node server.js`));
    return false;
  }
}

// ─── Step 2: 发送 sensor 数据 ────────────────────────────────────────
async function sendSensorData(payload) {
  const { label, data, expectedCommand } = payload;
  console.log(cyan(`\n  📡 发送: ${label}`));

  const { status, body } = await post('/api/sensors', data);

  if (status !== 201) {
    console.log(red(`    ❌ POST 失败 (HTTP ${status})`));
    console.log(red(`    ${JSON.stringify(body)}`));
    return null;
  }

  const gotCommand = body.command?.command || body.aiDecision?.command || 'UNKNOWN';
  const pass = gotCommand === expectedCommand;

  console.log(`    HTTP: ${green(status)}`);
  console.log(`    Command: ${pass ? green(gotCommand) : red(gotCommand)} ${pass ? '✅' : `❌ (expected ${expectedCommand})`}`);
  console.log(`    Reason: ${body.command?.reason || body.aiDecision?.reason || '-'}`);

  return body;
}

// ─── Step 3: 验证 database 存进去了 ─────────────────────────────────
async function verifyDatabase() {
  console.log(bold('\n🗄️  Step 3: 验证 database 有存到数据...'));

  // 查最新一笔
  const latest = await get('/api/sensors/latest?deviceId=farm_001');
  if (!latest.body.reading) {
    console.log(red('  ❌ 查不到最新 reading，database 可能没连上'));
    return;
  }
  console.log(green('  ✅ 最新 reading:'));
  console.log(`    deviceId:  ${latest.body.reading.deviceId}`);
  console.log(`    soilRaw:   ${latest.body.reading.soilRaw}`);
  console.log(`    gasRaw:    ${latest.body.reading.gasRaw}`);
  console.log(`    lightRaw:  ${latest.body.reading.lightRaw}`);
  console.log(`    ph:        ${latest.body.reading.ph}`);
  console.log(`    createdAt: ${latest.body.reading.createdAt}`);

  // 查历史记录数量
  const history = await get('/api/sensors/history?deviceId=farm_001&limit=100');
  const count = history.body.readings?.length ?? 0;
  console.log(green(`\n  ✅ 历史共 ${count} 笔 reading 在 database`));

  // 查 pending command
  const cmd = await get('/api/sensors/command?deviceId=farm_001');
  console.log(green(`\n  ✅ 最新 pending command: ${cmd.body.command}`));
  console.log(`    Reason: ${cmd.body.reason}`);
}

// ─── Step 4: 查 preferences ─────────────────────────────────────────
async function checkPreferences() {
  console.log(bold('\n⚙️  Step 4: 查 user preferences...'));
  const { body } = await get('/api/sensors/preferences?deviceId=farm_001');
  // preferences 直接在 body 里（不是 body.preferences）
  const p = body.soilDryThreshold !== undefined ? body : body.preferences || body;
  console.log(green('  ✅ Preferences:'));
  console.log(`    soilDryThreshold:   ${p.soilDryThreshold}`);
  console.log(`    gasDangerThreshold: ${p.gasDangerThreshold}`);
  console.log(`    darkThreshold:      ${p.darkThreshold}`);
  console.log(`    phMin / phMax:      ${p.phMin} ~ ${p.phMax}`);
  console.log(`    wateringDuration:   ${p.wateringDurationSeconds}s`);
  console.log(`    sensorInterval:     ${p.sensorIntervalSeconds}s`);
}

// ─── Main ────────────────────────────────────────────────────────────
async function main() {
  console.log(bold('═══════════════════════════════════════'));
  console.log(bold('  SeedDown Sensor Test Script'));
  console.log(bold('═══════════════════════════════════════'));

  const backendOk = await checkBackend();
  if (!backendOk) return;

  console.log(bold('\n📤 Step 2: 发送 5 种 sensor 场景...'));
  for (const payload of sensorPayloads) {
    await sendSensorData(payload);
    await new Promise((r) => setTimeout(r, 500)); // 每次间隔 0.5s
  }

  await verifyDatabase();
  await checkPreferences();

  console.log(bold('\n═══════════════════════════════════════'));
  console.log(bold('  测试完成！'));
  console.log(bold('═══════════════════════════════════════\n'));
}

main().catch((e) => {
  console.error(red(`\n❌ 脚本出错: ${e.message}`));
  process.exit(1);
});
