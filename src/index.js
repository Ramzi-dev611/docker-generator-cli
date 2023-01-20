#!/user/bin/env node 
import chalk from 'chalk'; // for colorful outputs
import chalkAnimation from 'chalk-animation'; // for colorful outputs
import inquirer from 'inquirer'; // for reading users input
import figlet from 'figlet'; // for ascii art
import gradient from 'gradient-string'; // for gradient colored text
import  { createSpinner } from 'nanospinner'; // creating spinners and ending processes


const sleep = async (time) => new Promise((r) => setTimeout(r, time));

const welcome = async () => {
    const header = 'Docker-init Cli';
    figlet(header, {
        font: 'Big Money-se',
        whitespaceBreak: false,
        width: 150
        }, async (err, data) => {
        if(err){
            console.error('Something went wrong ...')
            console.dir(err);
            return;
        }
        console.log(gradient.pastel.multiline(data));
        const rainbow = chalkAnimation.glitch("Welcome to docker init cli")
        await sleep(2000);
        rainbow.stop()
    });
};

await welcome()