const csv = require('csv-parser');
const fetch = require('node-fetch');

const PRICECATCHER_CATALOG_URL = 'https://data.gov.my/data-catalogue/pricecatcher';
const PRICECATCHER_DATA_BASE = 'https://storage.data.gov.my/pricecatcher';
const LOOKUP_ITEM_URL = `${PRICECATCHER_DATA_BASE}/lookup_item.csv`;
const LOOKUP_PREMISE_URL = `${PRICECATCHER_DATA_BASE}/lookup_premise.csv`;
const FAMA_URL = 'https://www.fama.gov.my/harga-pasaran-terkini';
const SELINA_BASE_URL = 'https://www.selinawamucii.com/insights/prices/malaysia';

const CACHE_MS = 6 * 60 * 60 * 1000;
const USD_TO_MYR_EST = 4.7;
const cache = new Map();

const FALLBACK_PRICES = {
  lettuce: 4.8,
  tomato: 7.2,
  basil: 12.0,
  spinach: 5.0,
  chili: 10.0,
  cucumber: 4.5,
  strawberry: 12.0,
  pepper: 8.0,
  mint: 15.0,
  carrot: 3.5,
  eggplant: 5.5,
  cabbage: 3.2,
  kangkung: 3.0,
  petai: 6.0,
};

const CROP_ALIASES = {
  lettuce: ['LETTUCE', 'SALAD', 'SALAD SAYUR'],
  tomato: ['TOMATO', 'TOMATO BIJI', 'TOMATO CHERRY'],
  basil: ['BASIL', 'DAUN SELASIH', 'SELASIH'],
  spinach: ['BAYAM', 'SPINACH'],
  chili: ['CILI', 'CHILLI', 'CABAI'],
  cucumber: ['TIMUN', 'CUCUMBER'],
  strawberry: ['STRAWBERRY'],
  pepper: ['CAPSICUM', 'BELL PEPPER', 'LADA BENGGALA'],
  mint: ['MINT', 'PUDINA'],
  carrot: ['CARROT', 'CARROTS', 'LOBAK MERAH'],
  eggplant: ['TERUNG', 'EGGPLANT', 'AUBERGINE', 'BRINJAL'],
  cabbage: ['KUBIS', 'CABBAGE', 'CABBAGES'],
  kangkung: ['KANGKUNG', 'KANGKONG'],
  petai: ['PETAI'],
};

const SELINA_SLUGS = {
  lettuce: 'lettuce',
  tomato: 'tomatoes',
  spinach: 'spinach',
  chili: 'peppers-various-types',
  cucumber: 'cucumber',
  strawberry: 'strawberries',
  pepper: 'capsicum-bell-pepper',
  carrot: 'carrots',
  eggplant: 'eggplants',
  cabbage: 'cabbages',
  basil: 'basil',
  mint: 'mint',
  kangkung: 'water-spinach',
};

function normalizeText(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

function cropId(value) {
  return normalizeText(value).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function getRowValue(row, names) {
  const lookup = Object.fromEntries(
    Object.keys(row).map((key) => [key.replace(/^\uFEFF/, '').toLowerCase(), key])
  );
  for (const name of names) {
    const key = lookup[name.toLowerCase()];
    if (key !== undefined) return row[key];
  }
  return undefined;
}

function cacheGet(key) {
  const hit = cache.get(key);
  if (!hit || Date.now() - hit.createdAt > CACHE_MS) return null;
  return hit.value;
}

function cacheSet(key, value) {
  cache.set(key, { createdAt: Date.now(), value });
  return value;
}

async function streamCsv(url, onRow) {
  const res = await fetch(url, {
    headers: { 'user-agent': 'SeedDown WhatIfPro market-price lookup' },
    timeout: 30000,
  });
  if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`);

  return new Promise((resolve, reject) => {
    res.body
      .pipe(csv())
      .on('data', (row) => {
        try {
          onRow(row);
        } catch (err) {
          reject(err);
        }
      })
      .on('end', resolve)
      .on('error', reject);
  });
}

async function loadCsvRows(url, key) {
  const cached = cacheGet(key);
  if (cached) return cached;

  const rows = [];
  await streamCsv(url, (row) => rows.push(row));
  return cacheSet(key, rows);
}

function buildItemMatches(crops, itemRows) {
  const itemToCrops = new Map();

  for (const crop of crops) {
    const id = cropId(crop.id || crop.name || crop);
    const name = crop.name || crop.id || crop;
    const aliases = (CROP_ALIASES[id] || [name, id]).map(normalizeText).filter(Boolean);

    for (const row of itemRows) {
      const code = String(getRowValue(row, ['item_code', 'item code']) || '').trim();
      const item = normalizeText(getRowValue(row, ['item', 'item_name', 'barangan', 'name']));
      if (!code || !item) continue;

      const matched = aliases.some((alias) => item.includes(alias));
      if (!matched) continue;

      if (!itemToCrops.has(code)) itemToCrops.set(code, []);
      itemToCrops.get(code).push({
        cropId: id,
        cropName: name,
        item: getRowValue(row, ['item', 'item_name', 'barangan', 'name']) || name,
        unit: getRowValue(row, ['unit', 'unit_of_measurement', 'uom']) || 'kg',
      });
    }
  }

  return itemToCrops;
}

function buildPremiseLookup(rows) {
  const map = new Map();
  for (const row of rows) {
    const code = String(getRowValue(row, ['premise_code', 'premise code']) || '').trim();
    if (!code) continue;
    map.set(code, {
      premise: getRowValue(row, ['premise', 'premise_name', 'name']) || '',
      premiseType: getRowValue(row, ['premise_type', 'premise type', 'type']) || '',
      state: getRowValue(row, ['state', 'negeri']) || '',
      district: getRowValue(row, ['district', 'daerah']) || '',
    });
  }
  return map;
}

function classifyPremise(premise) {
  const text = normalizeText(`${premise?.premiseType || ''} ${premise?.premise || ''}`);
  if (!text) return null;

  if (
    /(PASAR AWAM|PASAR BASAH|PASAR TANI|WET MARKET)/.test(text)
    || (/\bPASAR\b/.test(text) && !/(PASAR RAYA|MINI MARKET|PASAR MINI)/.test(text))
  ) {
    return 'pasar';
  }

  if (
    /(HYPERMARKET|SUPERMARKET|PASAR RAYA|GROCERY|GROCER|AEON|LOTUS|TESCO|GIANT|MYDIN|NSK|JAYA GROCER|VILLAGE GROCER|99 SPEEDMART)/.test(text)
  ) {
    return 'supermarket';
  }

  return null;
}

function monthKeys(start = new Date()) {
  return Array.from({ length: 6 }, (_, offset) => {
    const d = new Date(start.getFullYear(), start.getMonth() - offset, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
}

function emptyScope() {
  return { latestDate: '', crops: {} };
}

function emptyStats() {
  return {
    pasar: { sum: 0, count: 0, min: Infinity, max: -Infinity, samples: [] },
    supermarket: { sum: 0, count: 0, min: Infinity, max: -Infinity, samples: [] },
  };
}

function resetForNewDate(scope, date) {
  scope.latestDate = date;
  scope.crops = {};
}

function addStat(scope, date, crop, channel, price, premise) {
  if (date > scope.latestDate) resetForNewDate(scope, date);
  if (date !== scope.latestDate) return;

  if (!scope.crops[crop.cropId]) scope.crops[crop.cropId] = emptyStats();
  const stat = scope.crops[crop.cropId][channel];
  stat.sum += price;
  stat.count += 1;
  stat.min = Math.min(stat.min, price);
  stat.max = Math.max(stat.max, price);
  if (stat.samples.length < 3) {
    stat.samples.push({
      item: crop.item,
      premise: premise.premise,
      premiseType: premise.premiseType,
      state: premise.state,
      district: premise.district,
      price,
    });
  }
}

function locationMatches(premise, options = {}) {
  const targetState = normalizeText(options.state);
  const targetDistrict = normalizeText(options.district);
  if (targetState && normalizeText(premise.state) !== targetState) return false;
  if (targetDistrict && normalizeText(premise.district) !== targetDistrict) return false;
  return Boolean(targetState || targetDistrict);
}

async function scanPriceCatcher(crops, options = {}) {
  const itemRows = await loadCsvRows(LOOKUP_ITEM_URL, 'lookup_item');
  const premiseRows = await loadCsvRows(LOOKUP_PREMISE_URL, 'lookup_premise');
  const itemToCrops = buildItemMatches(crops, itemRows);
  const premiseByCode = buildPremiseLookup(premiseRows);

  for (const month of monthKeys()) {
    const national = emptyScope();
    const local = emptyScope();
    const url = `${PRICECATCHER_DATA_BASE}/pricecatcher_${month}.csv`;

    try {
      await streamCsv(url, (row) => {
        const itemCode = String(getRowValue(row, ['item_code', 'item code']) || '').trim();
        const premiseCode = String(getRowValue(row, ['premise_code', 'premise code']) || '').trim();
        const date = String(getRowValue(row, ['date']) || '').trim();
        const price = Number(getRowValue(row, ['price']));
        if (!itemCode || !premiseCode || !date || !Number.isFinite(price) || price <= 0) return;

        const cropMatches = itemToCrops.get(itemCode);
        if (!cropMatches?.length) return;

        const premise = premiseByCode.get(premiseCode);
        const channel = classifyPremise(premise);
        if (!premise || !channel) return;

        for (const crop of cropMatches) {
          addStat(national, date, crop, channel, price, premise);
          if (locationMatches(premise, options)) addStat(local, date, crop, channel, price, premise);
        }
      });

      const hasRecords = Object.keys(national.crops).length > 0 || Object.keys(local.crops).length > 0;
      if (hasRecords) return { month, url, national, local };
    } catch (err) {
      console.warn(`[MarketPrice] PriceCatcher ${month} skipped:`, err.message);
    }
  }

  return { month: null, url: null, national: emptyScope(), local: emptyScope() };
}

function finalizeChannel(stat, label, sourceUrl, asOf) {
  if (!stat?.count) return null;
  return {
    label,
    price: Number((stat.sum / stat.count).toFixed(2)),
    min: Number(stat.min.toFixed(2)),
    max: Number(stat.max.toFixed(2)),
    records: stat.count,
    samples: stat.samples,
    source: 'PriceCatcher',
    sourceUrl,
    asOf,
  };
}

async function fetchSelinaPrice(crop) {
  const id = cropId(crop.id || crop.name || crop);
  const slug = SELINA_SLUGS[id] || id.replace(/_/g, '-');
  const url = `${SELINA_BASE_URL}/${slug}/`;
  const cacheKey = `selina_${slug}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(url, {
      headers: { 'user-agent': 'SeedDown WhatIfPro export-price lookup' },
      timeout: 12000,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    const exportMatches = [...html.matchAll(/(?:export price[^.]{0,160}?)(?:US\$|US dollars?)\s*([0-9]+(?:\.[0-9]+)?)/gi)];
    const retailMyrMatch = html.match(/retail price range in Malaysian Ringgit[^.]*?between\s+MYR\s*([0-9]+(?:\.[0-9]+)?)\s+and\s+MYR\s*([0-9]+(?:\.[0-9]+)?)/i);
    const exportUsd = exportMatches.length ? Number(exportMatches[exportMatches.length - 1][1]) : null;
    const retailMyr = retailMyrMatch
      ? (Number(retailMyrMatch[1]) + Number(retailMyrMatch[2])) / 2
      : null;

    const value = {
      url,
      exportUsd: Number.isFinite(exportUsd) ? exportUsd : null,
      exportMyr: Number.isFinite(exportUsd) ? Number((exportUsd * USD_TO_MYR_EST).toFixed(2)) : null,
      retailMyr: Number.isFinite(retailMyr) ? Number(retailMyr.toFixed(2)) : null,
    };
    return cacheSet(cacheKey, value);
  } catch (err) {
    console.warn(`[MarketPrice] Selina ${slug} skipped:`, err.message);
    return cacheSet(cacheKey, { url, exportUsd: null, exportMyr: null, retailMyr: null });
  }
}

function bestChannel(channels) {
  return Object.entries(channels)
    .filter(([, channel]) => Number.isFinite(channel?.price))
    .sort((a, b) => b[1].price - a[1].price)[0]?.[0] || null;
}

async function getMarketPricesForCrops(crops = [], options = {}) {
  const normalizedCrops = crops.map((crop) => ({
    id: cropId(crop.id || crop.name || crop),
    name: crop.name || crop.id || crop,
  })).filter((crop) => crop.id);

  const cacheKey = `market_${normalizedCrops.map((crop) => crop.id).sort().join('_')}_${normalizeText(options.state)}_${normalizeText(options.district)}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const scan = await scanPriceCatcher(normalizedCrops, options);
  const exportRefs = await Promise.all(normalizedCrops.map((crop) => fetchSelinaPrice(crop)));
  const exportByCrop = Object.fromEntries(normalizedCrops.map((crop, index) => [crop.id, exportRefs[index]]));
  const prices = {};

  for (const crop of normalizedCrops) {
    const localStats = scan.local.crops[crop.id];
    const nationalStats = scan.national.crops[crop.id];
    const useLocal = Boolean(localStats?.pasar?.count || localStats?.supermarket?.count);
    const stats = useLocal ? localStats : nationalStats;
    const pricecatcherUrl = scan.url || `${PRICECATCHER_DATA_BASE}/pricecatcher_${monthKeys()[0]}.csv`;
    const asOf = useLocal ? scan.local.latestDate : scan.national.latestDate;
    const fallback = FALLBACK_PRICES[crop.id] || 5;
    const selina = exportByCrop[crop.id] || {};

    const channels = {
      pasar: finalizeChannel(stats?.pasar, 'Pasar', pricecatcherUrl, asOf),
      supermarket: finalizeChannel(stats?.supermarket, 'Supermarket', pricecatcherUrl, asOf),
      export: selina.exportMyr ? {
        label: 'Export ref.',
        price: selina.exportMyr,
        currencyNote: `Converted from USD/kg at indicative USD/MYR ${USD_TO_MYR_EST}`,
        records: null,
        source: 'Selina Wamucii',
        sourceUrl: selina.url,
        asOf: 'latest public page',
      } : null,
    };

    if (!channels.pasar) {
      channels.pasar = {
        label: 'Pasar',
        price: fallback,
        records: 0,
        source: 'Fallback estimate',
        sourceUrl: FAMA_URL,
        asOf: null,
      };
    }

    if (!channels.supermarket) {
      channels.supermarket = {
        label: 'Supermarket',
        price: Number(((selina.retailMyr || fallback) * 1.08).toFixed(2)),
        records: 0,
        source: selina.retailMyr ? 'Selina Wamucii retail reference' : 'Fallback estimate',
        sourceUrl: selina.url || PRICECATCHER_CATALOG_URL,
        asOf: selina.retailMyr ? 'latest public page' : null,
      };
    }

    if (!channels.export) {
      channels.export = {
        label: 'Export ref.',
        price: Number((Math.max(channels.pasar.price, channels.supermarket.price) * 1.12).toFixed(2)),
        records: 0,
        source: 'Fallback export estimate',
        sourceUrl: selina.url || FAMA_URL,
        asOf: null,
      };
    }

    const best = bestChannel(channels);
    prices[crop.id] = {
      cropId: crop.id,
      cropName: crop.name,
      unit: 'kg',
      locationScope: useLocal ? 'selected location' : 'national',
      live: Boolean(stats?.pasar?.count || stats?.supermarket?.count),
      asOf: asOf || null,
      channels,
      bestChannel: best,
      bestPrice: best ? channels[best].price : fallback,
    };
  }

  return cacheSet(cacheKey, {
    ok: true,
    generatedAt: new Date().toISOString(),
    pricecatcherMonth: scan.month,
    sources: [
      {
        label: 'PriceCatcher transactional records',
        url: PRICECATCHER_CATALOG_URL,
        note: 'Malaysia official open-data price surveillance dataset by KPDN/DOSM.',
      },
      {
        label: 'PriceCatcher CSV used by this endpoint',
        url: scan.url || `${PRICECATCHER_DATA_BASE}/pricecatcher_${monthKeys()[0]}.csv`,
        note: 'Daily retail records filtered by crop and premise type.',
      },
      {
        label: 'FAMA Harga Pasaran Terkini',
        url: FAMA_URL,
        note: 'Official FAMA market-price reference page.',
      },
      {
        label: 'Selina Wamucii Malaysia export references',
        url: `${SELINA_BASE_URL}/vegetables/`,
        note: 'Public export/wholesale reference pages used for export comparison.',
      },
    ],
    prices,
  });
}

module.exports = {
  getMarketPricesForCrops,
};
