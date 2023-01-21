import figlet from 'figlet'; // for ascii art
import gradient from 'gradient-string'; // for gradient colored text
import chalkAnimation from 'chalk-animation'; // for colorful outputs
import chalk from 'chalk'; // for colorful outputs

import { sleep } from './utilities/sleep.js'

const welcome = async () => {
    const header = 'Docker-init Cli';
    let rainbow;
    figlet(header, {
        font: 'Big Money-ne',
        whitespaceBreak: false,
        horizontalLayout: 'full',
        width: 150
    }, (err, data) => {
        if (err) {
            console.error('Something went wrong ...')
            console.dir(err);
            return;
        }
        console.log(gradient.summer.multiline(data));
        rainbow = chalkAnimation.rainbow("Welcome to docker init cli");
    });
    await sleep(3000);
    rainbow.stop();
    console.log(`This cli tool is created to help you create started ${chalk.bgGreen('Dockerfiles')} and ${chalk.bgGreen('docker-compose files')} from predefined templates`)
    console.log(`All you have to do is to specify the file you want to generate and the it's spec`)
    console.log(`For any information about the source code of this cli visit the github repository: https://github.com/Ramzi-dev611/docker-generator-cli`)
};

export default welcome;