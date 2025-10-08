// Central definition of plan capabilities and limits
// This is a pure module (no side-effects) so it can be imported anywhere.

export const PLAN_IDS = Object.freeze({
  FREE: 'free',
  PLUS: 'plus',
  PRO: 'pro',
  ENTERPRISE: 'enterprise'
});

// Capability semantics:
//  - maxBatchFiles: maximum number of files user can add in one conversion operation
//  - maxFileSizeMB: maximum individual file size
//  - formats: categories allowed (core, svg, advanced, vector)
//  - features: boolean flags for gating UI/functionality
//  - storageMB: allocated cloud storage (placeholder until backend implemented)
//  - api: API quota info placeholder
//  - historyRetention: duration string or 'unlimited'
//  - label: short human-readable label

export const PLAN_CAPABILITIES = {
  [PLAN_IDS.FREE]: {
    label: 'Free',
    maxBatchFiles: 10,
    maxFileSizeMB: 25,
    formats: {
      core: true,
      svg: false,
      advanced: false,
      vector: false
    },
    features: {
      basicEdit: true,
      cropResize: false,
      advancedEdit: false,
      aiCompression: false,
      batchAutomation: false,
      apiAccess: false,
      cloudStorage: false,
      whiteLabel: false
    },
    storageMB: 0,
    api: { quotaMonthly: 0 },
    historyRetention: 'session'
  },
  [PLAN_IDS.PLUS]: {
    label: 'Plus',
    maxBatchFiles: 100,
    maxFileSizeMB: 150,
    formats: {
      core: true,
      svg: true,
      advanced: false,
      vector: false
    },
    features: {
      basicEdit: true,
      cropResize: true,
      advancedEdit: false,
      aiCompression: false,
      batchAutomation: false,
      apiAccess: false,
      cloudStorage: false,
      whiteLabel: false
    },
    storageMB: 0,
    api: { quotaMonthly: 0 },
    historyRetention: '30d'
  },
  [PLAN_IDS.PRO]: {
    label: 'Pro',
    maxBatchFiles: Infinity,
    maxFileSizeMB: 500,
    formats: {
      core: true,
      svg: true,
      advanced: true,
      vector: true
    },
    features: {
      basicEdit: true,
      cropResize: true,
      advancedEdit: true,
      aiCompression: true,
      batchAutomation: false,
      apiAccess: true,
      cloudStorage: true,
      whiteLabel: false
    },
    storageMB: 100 * 1024, // 100GB
    api: { quotaMonthly: 10000 },
    historyRetention: 'unlimited'
  },
  [PLAN_IDS.ENTERPRISE]: {
    label: 'Enterprise',
    maxBatchFiles: Infinity,
    maxFileSizeMB: Infinity,
    formats: {
      core: true,
      svg: true,
      advanced: true,
      vector: true
    },
    features: {
      basicEdit: true,
      cropResize: true,
      advancedEdit: true,
      aiCompression: true,
      batchAutomation: true,
      apiAccess: true,
      cloudStorage: true,
      whiteLabel: true
    },
    storageMB: 1024 * 1024, // 1TB
    api: { quotaMonthly: 25000 },
    historyRetention: 'unlimited'
  }
};

export function getCapabilities(planId) {
  return PLAN_CAPABILITIES[planId] || PLAN_CAPABILITIES[PLAN_IDS.FREE];
}

export function canUseFeature(planId, featureKey) {
  const caps = getCapabilities(planId);
  return !!caps.features[featureKey];
}

export function limitFor(planId, key) {
  const caps = getCapabilities(planId);
  return caps[key];
}
