import { performance } from 'node:perf_hooks';
import { EcosystemCircuitBreaker, checkRepoHealth } from '../scripts/ecosystem_health.mjs';

async function runBenchmark() {
  const iterations = 50_000;
  const cb = new EcosystemCircuitBreaker();
  const latencies = [];

  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    const t0 = performance.now();
    await checkRepoHealth('sample-repo', { circuitBreaker: cb });
    const t1 = performance.now();
    latencies.push((t1 - t0) * 1000);
  }
  const end = performance.now();

  latencies.sort((a, b) => a - b);
  const p50 = latencies[Math.floor(latencies.length * 0.50)];
  const p90 = latencies[Math.floor(latencies.length * 0.90)];
  const p99 = latencies[Math.floor(latencies.length * 0.99)];
  const elapsedSec = (end - start) / 1000;

  console.log("=== Ecosystem Telemetry Benchmark ===");
  console.log(`Total Cycles: ${iterations.toLocaleString()}`);
  console.log(`Throughput:   ${Math.round(iterations / elapsedSec).toLocaleString()} checks/sec`);
  console.log(`Latency P50:  ${p50.toFixed(2)} microseconds`);
  console.log(`Latency P90:  ${p90.toFixed(2)} microseconds`);
  console.log(`Latency P99:  ${p99.toFixed(2)} microseconds`);
}

runBenchmark();
