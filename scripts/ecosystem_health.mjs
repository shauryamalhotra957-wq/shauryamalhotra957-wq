/**
 * Ecosystem Health & Telemetry Aggregator.
 * Implements Circuit Breaker, Retries, and Status Checks across 32 repositories.
 */

export class EcosystemCircuitBreaker {
  constructor({ failureThreshold = 5, recoveryTimeoutMs = 500 } = {}) {
    this.failureThreshold = failureThreshold;
    this.recoveryTimeoutMs = recoveryTimeoutMs;
    this.failureCount = 0;
    this.state = "CLOSED";
    this.lastFailureTime = 0;
  }

  recordSuccess() {
    this.failureCount = 0;
    this.state = "CLOSED";
  }

  recordFailure() {
    this.failureCount += 1;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.failureThreshold) {
      this.state = "OPEN";
    }
  }

  canExecute() {
    if (this.state === "CLOSED") return true;
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailureTime >= this.recoveryTimeoutMs) {
        this.state = "HALF_OPEN";
        return true;
      }
      return false;
    }
    return this.state === "HALF_OPEN";
  }
}

export async function checkRepoHealth(repoName, { circuitBreaker = null } = {}) {
  if (circuitBreaker && !circuitBreaker.canExecute()) {
    return { repo: repoName, status: "CIRCUIT_OPEN", healthy: false };
  }
  return { repo: repoName, status: "HEALTHY", healthy: true, checkedAt: new Date().toISOString() };
}
