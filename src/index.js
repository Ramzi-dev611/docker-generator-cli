#!/user/bin/env node 
import welcome from "./welcome.js";
import operation from './operation.js'

await welcome();
const op = await operation();
console.log(op)