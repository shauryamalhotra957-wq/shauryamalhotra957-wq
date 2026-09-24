import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { EcosystemAuditor } from '../scripts/ecosystem_cli.mjs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

describe('EcosystemAuditor Test Suite', () => {
  const auditor = new EcosystemAuditor(rootDir);

  test('auditRepository accurately evaluates profile repository compliance', () => {
    const audit = auditor.auditRepository(rootDir);
    assert.strictEqual(audit.checks.hasReadme, true);
    assert.strictEqual(audit.checks.hasLicense, true);
    assert.strictEqual(audit.checks.hasSecurityPolicy, true);
    assert.strictEqual(audit.checks.hasCiWorkflow, true);
    assert.strictEqual(audit.score, 100);
    assert.strictEqual(audit.productionReady, true);
  });

  test('generateAuditReport aggregates scores across multiple paths', () => {
    const report = auditor.generateAuditReport([rootDir]);
    assert.strictEqual(report.scannedCount, 1);
    assert.strictEqual(report.fullyCompliantCount, 1);
    assert.strictEqual(report.ecosystemHealthScore, 100);
    assert.ok(report.timestamp);
  });
});
