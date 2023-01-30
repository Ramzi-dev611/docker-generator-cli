import { createSpinner } from "nanospinner";
import inquirer from "inquirer";
import { sleep } from "./utilities/sleep.js";
import getTemplate from './utilities/getTemplate.js'

const JSFrontendApplicationTypes = {
    react: 'React',
    angular: 'Angular',
    vue: 'Vue',
}

const JSServerApplicationTypes = {
    next: 'Nextjs',
    nestjs: 'Nestjs',
}

const JavaapplicationTypes = {
    springboot: 'Spring-Boot',
}

const CSApplicationTypes = {
    dotNet: 'DotNet',
}

const PythonApplicationTypes = {
    django: 'Django',
    flask: 'Flask',
    fastApi: 'FastApi'
}

const JSApplicationTypes = {
    ...JSFrontendApplicationTypes,
    ...JSServerApplicationTypes,
}

const applicationTypes = {
    ...JSApplicationTypes,
    ...JavaapplicationTypes,
    ...CSApplicationTypes,
    ...PythonApplicationTypes
}

const environmentTypes = {
    dev: 'development',
    production: 'production'
}


const javaBasedDockerfileGenerator = async () => {

}

const javascriptBasedDockerfileGenerator = async () => {

}

const csharpBasedDockerfileGenerator = async () => {

}

const pythonBasedDockerfileGenerator = async () => {

}

const dockerfileGenerator = async () => {
    console.clear();
    const spinner = createSpinner('Docker file generator').start();
    await sleep(1000);
    spinner.stop();
    const applivationTypeAnswer = await inquirer.prompt({
        name: 'application_type',
        message: 'what kind of application are you working on',
        type: 'list',
        choices: Object.values(applicationTypes),
    });
    const appType = applicationTypeAnswer.application_type;
    if (!Object.values(CSApplicationTypes).includes(appType)) {
        const environmentTypeAnswer = await inquirer.prompt({
            name: 'application_env',
            message: 'what is the environment that you are trying to create',
            type: 'list',
            choices: Object.values(environmentTypes),
        })
        const envType = environmentTypeAnswer.application_env;
        const content = await getTemplate(appType, envType);
        console.log(content);
    } else {
        // Handle Dotnet
    }
}

export default dockerfileGenerator; 