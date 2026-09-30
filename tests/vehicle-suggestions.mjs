import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import Module from 'node:module';
const cache = new Map();
function load(filename) {
  filename = path.resolve(filename);
  if (cache.has(filename)) return cache.get(filename).exports;
  const mod = { exports: {} }; cache.set(filename, mod);
  const nativeRequire = Module.createRequire(filename);
  const localRequire = name => name.startsWith('.') || name.startsWith('@/')
    ? load((name.startsWith('@/') ? path.resolve('src', name.slice(2)) : path.resolve(path.dirname(filename), name)) + '.ts')
    : nativeRequire(name);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  new Function('require', 'module', 'exports', code)(localRequire, mod, mod.exports);
  return mod.exports;
}
const { suggestVehicles, reconcileVehicle } = load('src/lib/vehicleSuggestions.ts');
const { initialPlannerState, formatEnquiry } = load('src/lib/enquiry.ts');
const ids = (passengers, service = 'city') => suggestVehicles({ passengers, service }).map(v => v.id);
assert.deepEqual(ids(1), ['alto', 'wagon-r', 'aqua', 'suzuki-every']);
assert.deepEqual(ids(4), ['aqua', 'suzuki-every']);
assert.deepEqual(ids(5), ['non-ac-van', 'kdh-9', 'kdh-14']);
assert.deepEqual(ids(8), ['kdh-9', 'kdh-14']);
assert.deepEqual(ids(14), ['kdh-14']);
for (const n of [15, 16, 29]) assert.deepEqual(ids(n), ['bus-29', 'bus-35', 'bus-55']);
assert.deepEqual(ids(30), ['bus-35', 'bus-55']);
for (const n of [36, 55]) assert.deepEqual(ids(n), ['bus-55']);
for (const n of [0, -1, 56, 1.5, NaN]) assert.deepEqual(ids(n), []);
assert.deepEqual(ids(1, 'lorry'), ['kama-mini-truck', 'lorry']);
assert.deepEqual(ids(2, 'lorry'), []);
assert.deepEqual(ids(1, 'long-trip'), ['bus-29', 'bus-35', 'bus-55']);
assert.deepEqual(ids(3, 'wedding'), ['wedding-luxury']);
assert.deepEqual(ids(4, 'wedding'), ['aqua', 'suzuki-every']);
assert.equal(reconcileVehicle({ ...initialPlannerState, vehicle: 'alto', passengers: 16 }).vehicle, '');
assert.equal(reconcileVehicle({ ...initialPlannerState, vehicle: 'alto', service: 'lorry' }).vehicle, '');
assert.equal(reconcileVehicle({ ...initialPlannerState, vehicle: 'assisted', passengers: 55 }).vehicle, 'assisted');
assert.equal(reconcileVehicle({ ...initialPlannerState, vehicle: 'aqua', passengers: 4 }).vehicle, 'aqua');
assert.match(formatEnquiry({ ...initialPlannerState, service: 'lorry', vehicle: 'kama-mini-truck' }), /Service: Lorry transport[\s\S]*Requested vehicle: KAMA 1–3T Mini Truck/);
console.log('Vehicle suggestion boundaries, service isolation, selection reconciliation and enquiry checks passed.');
