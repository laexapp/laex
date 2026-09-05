import test from 'node:test';
import assert from 'node:assert/strict';
import { initialDemo, parseUnits, validateSend, simulateSend, simulateReceive, maxSend, inputAmount, DEMO_FEE } from '../modules/laex-wallet/demo-model.ts';

test('decimal inputs use exact integer units and reject malformed or unsafe amounts', () => {
  assert.equal(parseUnits('0,000001', 'USDT'), 1);
  assert.equal(parseUnits('1.000001', 'USDT'), 1000001);
  for (const value of ['0', '-1', 'Infinity', '1e3', 'NaN', '1.2.3', '0.0000001', '999999999999999999']) assert.equal(parseUnits(value, 'USDT'), null);
  assert.equal(inputAmount(1250000000, 'USDT'), '1250');
});
test('real addresses are never accepted by this demo', () => {
  assert.match(validateSend(initialDemo(), 'USDT', '1', '0x0000000000000000000000000000000000000001'), /no acepta direcciones reales/);
});
test('USDT sending deducts exact amount and BNB fee without mutating previous state', () => {
  const original = initialDemo();
  const next = simulateSend(original, 'USDT', '25.000001', 'LAEX-DEMO-002');
  assert.equal(next.balances.USDT, 1224999999);
  assert.equal(next.balances.BNB, original.balances.BNB - DEMO_FEE);
  assert.equal(original.movements.length, 2);
  assert.equal(next.movements[0].units, 25000001);
  assert.equal(next.movements[0].id, 'DEMO-003');
});
test('BNB max reserves the fee and leaves zero rather than a negative balance', () => {
  const original = initialDemo();
  const maximum = inputAmount(maxSend(original, 'BNB'), 'BNB');
  assert.equal(simulateSend(original, 'BNB', maximum, 'LAEX-DEMO-002').balances.BNB, 0);
  assert.throws(() => simulateSend(original, 'BNB', '0.08', 'LAEX-DEMO-002'));
});
test('insufficient token balance and missing gas are rejected', () => {
  assert.throws(() => simulateSend(initialDemo(), 'USDT', '1251', 'LAEX-DEMO-002'));
  const emptyGas = { ...initialDemo(), balances: { BNB: 0, USDT: 1250000000 } };
  assert.match(validateSend(emptyGas, 'USDT', '1', 'LAEX-DEMO-002'), /Falta BNB/);
});
test('simulated receipt updates only the chosen asset and appends a unique movement', () => {
  const original = initialDemo();
  const next = simulateReceive(original, 'USDT');
  const again = simulateReceive(next, 'BNB');
  assert.equal(next.balances.USDT, original.balances.USDT + 25000000);
  assert.equal(next.balances.BNB, original.balances.BNB);
  assert.notEqual(next.movements[0].id, again.movements[0].id);
});
