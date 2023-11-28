#!/user/bin/env node 
import welcome from "./welcome.js";
import operation, { Operationtypes } from './operation.js'
import generateDockerFile from './dockerfile-generator.js';
await welcome();
let op = '';
while(op !== Operationtypes.exit) {
    op = await operation();
    if (op === Operationtypes.dockerfile) {
        await generateDockerFile();
    } else if (op == Operationtypes.dockerCompose) {
    } else {
        
    }
}
process.exit(0);
