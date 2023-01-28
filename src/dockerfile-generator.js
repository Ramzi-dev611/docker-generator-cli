import { createSpinner } from "nanospinner";
import inquirer from "inquirer";
import { sleep } from "./utilities/sleep.js";
import getTemplate from './utilities/getTemplate.js'

export const applicationTypes = {
    react: 'React',
    angular: 'Angular',
    vue: 'Vue',
    next: 'Nextjs',
    nestjs: 'Nestjs',
    springboot: 'Spring-Boot',
    dotNet: 'DotNet',
    django: 'Django',
    flask: 'Flask',
    fastApi: 'FastApi'
}

export const environmentTypes = {
    dev: 'development',
    production: 'production'
}

const dockerfileGenerator = async () => {
    console.clear();
    const spinner = createSpinner('Docker file generator').start();
    await sleep(1000);
    spinner.stop();
    const templateFileAnswers = await inquirer.prompt([{
        name: 'application_type',
        message: 'what kind of application are you working on',
        type: 'list',
        choices: Object.values(applicationTypes),
    },
    {
        name: 'application_env',
        message: 'what is the environment that you are trying to create',
        type: 'list',
        choices: Object.values(environmentTypes),
    }])
    const dockerfile = `${templateFileAnswers.application_type}.${templateFileAnswers.application_env}`;
    const content = await getTemplate(templateFileAnswers.application_type, templateFileAnswers.application_env)
    console.log(content);
}

export default dockerfileGenerator; 