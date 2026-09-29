import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';

// Run the real TypeScript modules with the project's existing compiler; no test dependency.
const require = createRequire(import.meta.url);
const cache = new Map();
function loadModule(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file).exports;
  const loaded = { exports: {} };
  cache.set(file, loaded);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const localRequire = (id) => {
    if (id.startsWith('@/')) return loadModule(path.join('src', id.slice(2) + '.ts'));
    if (id.startsWith('.')) return loadModule(path.resolve(path.dirname(file), id + '.ts'));
    return require(id);
  };
  const execute = vm.runInThisContext(`(function(require,module,exports){${code}\n})`, { filename: file });
  execute(localRequire, loaded, loaded.exports);
  return loaded.exports;
}
const { initialPlannerState, plannerLinkValues, formatEnquiry, whatsappUrl, serviceRequirements } = loadModule('src/lib/enquiry.ts');
const { validatePlannerStep, sriLankaNow } = loadModule('src/lib/planner-validation.ts');
const { vehicles, services } = loadModule('src/data/content.ts');
const timestamp = new Date('2026-09-29T18:45:00Z'); // September 30, 00:15 in Colombo.
const journey = { ...initialPlannerState, pickup: 'Custom Lane, Wattala', destination: 'Another custom address', date: '2026-09-30', time: '00:16', passengers: 4 };

test('entry parameters accept every known service/vehicle and ignore personal or unknown values', () => {
  for (const service of services) assert.equal(plannerLinkValues(`?service=${service.id}`).service, service.id);
  for (const vehicle of vehicles) assert.equal(plannerLinkValues(`?vehicle=${vehicle.id}`).vehicle, vehicle.id);
  assert.deepEqual(plannerLinkValues('?service=unknown&vehicle=unknown&name=Private&phone=123'), {});
  assert.deepEqual(plannerLinkValues('?service=airport&vehicle=kdh-14&name=Private'), { service: 'airport', vehicle: 'kdh-14' });
});
test('entry links merge into the existing journey without clearing other details', () => {
  const merged = { ...journey, ...plannerLinkValues('?vehicle=kdh-14') };
  for (const key of ['service', 'tripType', 'pickup', 'destination', 'date', 'passengers']) assert.equal(merged[key], journey[key]);
  assert.equal(merged.vehicle, 'kdh-14');
});
test('Colombo midnight rollover and future pickup validation are independent of machine timezone', () => {
  const now = sriLankaNow(timestamp);
  assert.equal(`${now.year}-${now.month}-${now.day} ${now.hour}:${now.minute}`, '2026-09-30 00:15');
  assert.deepEqual(validatePlannerStep(0, journey, timestamp), {});
  assert.ok(validatePlannerStep(0, { ...journey, date: '2026-09-29', time: '23:59' }, timestamp).date);
  assert.ok(validatePlannerStep(0, { ...journey, time: '00:15' }, timestamp).date);
});
test('return fields each receive errors and return must follow pickup', () => {
  const data = { ...journey, tripType: 'return' };
  const missing = validatePlannerStep(0, data, timestamp);
  assert.ok(missing.returnDate);
  assert.ok(missing.returnTime);
  assert.ok(validatePlannerStep(0, { ...data, returnDate: journey.date, returnTime: journey.time }, timestamp).returnDate);
  assert.deepEqual(validatePlannerStep(0, { ...data, returnDate: journey.date, returnTime: '02:00' }, timestamp), {});
});
test('custom locations are accepted, equal locations and invalid passenger counts rejected', () => {
  assert.deepEqual(validatePlannerStep(0, journey, timestamp), {});
  assert.ok(validatePlannerStep(0, { ...journey, destination: ` ${journey.pickup.toUpperCase()} ` }, timestamp).destination);
  for (const passengers of [0, -1, 1.5, 51, NaN]) assert.ok(validatePlannerStep(0, { ...journey, passengers }, timestamp).passengers);
});
test('retained vehicle must accommodate passengers or an assisted choice is required', () => {
  assert.ok(validatePlannerStep(1, { ...journey, vehicle: 'sedan' }).vehicle);
  assert.ok(validatePlannerStep(1, { ...journey, vehicle: 'invalid' }).vehicle);
  assert.deepEqual(validatePlannerStep(1, { ...journey, vehicle: 'kdh-14' }), {});
  assert.deepEqual(validatePlannerStep(1, { ...journey, vehicle: 'assisted', passengers: 50 }), {});
});
test('contact validation rejects punctuation-only phone numbers and keeps email optional', () => {
  assert.ok(validatePlannerStep(2, { ...journey, name: 'Test', phone: '--------' }).phone);
  assert.ok(validatePlannerStep(2, { ...journey, name: ' ', phone: '+94 72 800 0400' }).name);
  assert.deepEqual(validatePlannerStep(2, { ...journey, name: 'Test', phone: '+94 72 800 0400' }), {});
  assert.ok(validatePlannerStep(2, { ...journey, name: 'Test', phone: '+94 72 800 0400', email: 'invalid' }).email);
});
test('prepared messages use all catalogue vehicle names, including Every and lorry', () => {
  for (const vehicle of vehicles) assert.ok(formatEnquiry({ ...journey, vehicle: vehicle.id }).includes(`Requested vehicle: ${vehicle.name}`));
});
test('only relevant optional service details and flight information enter the message', () => {
  const requirements = Object.fromEntries(Object.keys(serviceRequirements).map(id => [id, `${id} test requirements`]));
  for (const service of Object.keys(serviceRequirements)) {
    const message = formatEnquiry({ ...journey, service, requirements, flight: 'TEST123' });
    assert.ok(message.includes(`${service} test requirements`));
    for (const other of Object.keys(serviceRequirements).filter(id => id !== service)) assert.ok(!message.includes(`${other} test requirements`));
    assert.equal(message.includes('Flight number: TEST123'), service === 'airport');
  }
});
test('WhatsApp URL round trips the full message without sending a request', () => {
  const data = { ...journey, service: 'airport', vehicle: 'suzuki-every', tripType: 'return', returnDate: '2026-10-01', returnTime: '12:00', name: 'QA & Test', phone: '+94 72 800 0400', notes: 'Door #2\nPlease call on arrival' };
  const url = new URL(whatsappUrl(data));
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/94728000400');
  assert.equal(url.searchParams.get('text'), formatEnquiry(data));
  assert.ok(formatEnquiry(data).includes('Return time: 2026-10-01 at 12:00 (Asia/Colombo)'));
  assert.ok(formatEnquiry(data).endsWith('Please confirm availability and the final price.'));
});
