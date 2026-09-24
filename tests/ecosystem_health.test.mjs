import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { EcosystemCircuitBreaker, checkRepoHealth } from '../scripts/ecosystem_health.mjs';

describe('Ecosystem Telemetry Unit & Resilience Suite', () => {
  test('EcosystemCircuitBreaker transitions to OPEN after consecutive failures', () => {
    const cb = new EcosystemCircuitBreaker({ failureThreshold: 3, recoveryTimeoutMs: 100 });
    assert.equal(cb.state, 'CLOSED');
    assert.equal(cb.canExecute(), true);

    cb.recordFailure();
    cb.recordFailure();
    assert.equal(cb.state, 'CLOSED');

    cb.recordFailure();
    assert.equal(cb.state, 'OPEN');
    assert.equal(cb.canExecute(), false);
  });

  test('EcosystemCircuitBreaker recovers after timeout', async () => {
    const cb = new EcosystemCircuitBreaker({ failureThreshold: 2, recoveryTimeoutMs: 50 });
    cb.recordFailure();
    cb.recordFailure();
    assert.equal(cb.state, 'OPEN');

    await new Promise((r) => setTimeout(r, 60));
    assert.equal(cb.canExecute(), true);
    assert.equal(cb.state, 'HALF_OPEN');

    cb.recordSuccess();
    assert.equal(cb.state, 'CLOSED');
  });

  test('checkRepoHealth returns healthy state when circuit is closed', async () => {
    const res = await checkRepoHealth('jarvis');
    assert.equal(res.status, 'HEALTHY');
    assert.equal(res.healthy, true);
  });

  test('checkRepoHealth reports CIRCUIT_OPEN when breaker trips', async () => {
    const cb = new EcosystemCircuitBreaker({ failureThreshold: 1, recoveryTimeoutMs: 1000 });
    cb.recordFailure();
    const res = await checkRepoHealth('jarvis', { circuitBreaker: cb });
    assert.equal(res.status, 'CIRCUIT_OPEN');
    assert.equal(res.healthy, false);
  });
});
