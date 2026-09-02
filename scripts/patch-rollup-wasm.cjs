const fs = require('node:fs');
const path = require('node:path');

const target = path.join(__dirname, '..', 'node_modules', 'rollup', 'dist', 'native.js');
const wasmBinding = path.join(__dirname, '..', 'node_modules', '@rollup', 'wasm-node', 'dist', 'native.js');

if (fs.existsSync(target) && fs.existsSync(wasmBinding)) {
  fs.writeFileSync(
    target,
    "module.exports = require('../../@rollup/wasm-node/dist/native.js');\n",
    'utf8',
  );
}
