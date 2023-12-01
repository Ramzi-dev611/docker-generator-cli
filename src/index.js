#!/user/bin/env node 
import welcome from "./welcome.js";
import operation, { Operationtypes } from './operation.js'
import generateDockerFile from './dockerfile-generator.js';
import chalk from "chalk";
import generateDockerComposeFile from "./docker-compose-generator.js";
await welcome();
let op = '';
while(op !== Operationtypes.exit) {
    op = await operation();
    if (op === Operationtypes.dockerfile) {
        await generateDockerFile();
    } else if (op === Operationtypes.dockerCompose)  {
        await generateDockerComposeFile();
    }
}
console.log(chalk.blue(chalk.bold('Thank you for using our application. Happy HACKING!!!')))
process.exit(0);
