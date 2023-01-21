import figlet from 'figlet'; // for ascii art
import gradient from 'gradient-string'; // for gradient colored text
import chalkAnimation from 'chalk-animation'; // for colorful outputs
import chalk from 'chalk'; // for colorful outputs

import { sleep } from './utilities/sleep.js'

const welcome = async () => {
    const header = 'Docker-init Cli';
    figlet(header, {
        font: 'Big Money-se',
        whitespaceBreak: false,
        horizontalLayout: 'full',
        width: 150
    }, async (err, data) => {
        if (err) {
            console.error('Something went wrong ...')
            console.dir(err);
            return;
        }
        console.log(gradient.summer.multiline(data));
        const rainbow = chalkAnimation.rainbow("Welcome to docker init cli")
        await sleep(5000);
        console.log(`
This cli tool is created to help you create started ${chalk.bgGreen('Dockerfiles')} and ${chalk.bgGreen('docker-compose files')} from predefined
templates
All you have to do is to specify the file you want to generate and the it's spec
For any information about the source code of this cli visit the github repository: https://github.com/Ramzi-dev611/docker-generator-cli
        `)
        rainbow.stop()
    });
};

export default welcome;