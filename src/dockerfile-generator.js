import { createSpinner } from "nanospinner";
import inquirer from "inquirer";
import { sleep } from "./utilities/sleep.js";
import getTemplate from './utilities/getTemplate.js'
import Mustache from 'mustache'

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

const getEnvironmentVariables = async (nbEnv) => {
    let enviroment_entries = "";
    for(let i =0; i< nbEnv; i++) {
        const envVar = await inquirer.prompt([
            {
                message: "What is the environment variable name?",
                name: 'env_name',
                type: 'input'
            }, 
            {
                message: "what is the value of this environment variable?",
                name: 'env_value',
                type: 'input'
            }
        ])
        enviroment_entries += `ENV ${envVar.env_name}=${envVar.env_value}\n\n`;
    }
    return enviroment_entries;
} 

const javaBasedDockerfileGenerator = async (content) => {
    const answers = await inquirer.prompt([
        {
            message: "What maven version you are working with?",
            name: 'mvn_version',
            type: "list",
            choices: ['3.8', '3.7', '3.6', '3.3']
        }, 
        {
            message: "What JDK version you are working with",
            name: "jdk_version",
            type: "list",
            choices: ['18', '17', '11', '9']
        }, 
        {
            message: "What port are you exposing the application through? (default is 8080)",
            name: "port",
            type: "number",
            default: "8080",
        },
        {
            message: "How many environment variables you want to define? (default is 0)",
            name: "nb_env",
            type: 'number',
            default: 0 
        }
    ])
    const enviroment_entries = getEnvironmentVariables(answers.nb_env);
    const values = {
        mvn_version: answers.mvn_version,
        jdk_version: answers.jdk_version,
        port: answers.port,
        environment_variables: enviroment_entries 
    };
    return Mustache.render(content, values);
}

const csharpBasedDockerfileGenerator = async (content) => {
    const answers = await inquirer.prompt([
        {
            message: "What dotnet sdk version are you working with?",
            name: "dotnet_sdk_version",
            type: "list",
            choices: ["7.0.2", "6.0.13", "6.0.12"]
        }, 
        {
            message: "What ASP.Net version you want to use?", 
            name: "aspnet_version",
            type: "list",
            choices: ["7.0.2", "6.0.13" ,"6.0.12"]
        },
        {
            message: "What port are you exposing the application through? (default is 8080)",
            name: "port",
            type: "number",
            default: "8080",
        }, 
        {
            message: "How many environment variables you want to define? (default is 0)",
            name: 'nb_env',
            type: 'number',
            default: 0
        }
    ]);
    const environment_entries = getEnvironmentVariables(answers.nb_env);
    const values = {
        dotnet_sdk_version: answers.dotnet_sdk_version,
        aspnet_version: answers.aspnet_version,
        port: answers.port,
        environment_variables: environment_entries
    };
    return Mustache.render(content, values);
}

const javascriptBasedDockerfileGenerator = async (content, appType) => {

}

const pythonBasedDockerfileGenerator = async () => {

}

const dockerfileGenerator = async () => {
    console.clear();
    const spinner = createSpinner('Docker file generator').start();
    await sleep(1000);
    spinner.stop();
    const applicationTypeAnswer = await inquirer.prompt({
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
        const generatorSpinner = createSpinner(`${appType} dockerfile generation in progress`).start();
        await sleep(1000);
        generatorSpinner.stop();
        let result ="";
        if(Object.values(JavaapplicationTypes).includes(appType)) {
            result = await javaBasedDockerfileGenerator(content);
        } else if(Object.values(PythonApplicationTypes).includes(appType)){
            result = await pythonBasedDockerfileGenerator(content);
        } else {
            result = await javascriptBasedDockerfileGenerator(content, appType)
        }
        generatorSpinner.success(`${appType} dockerfile generated successfully`);
        console.log("\n\n")
        console.log(result)
        console.log("\n\n")
    } else {
        const content = await getTemplate(appType, 'dockerfile');
        const csSpinner = createSpinner('Dotnetdockerfile generation in progress').start();
        await sleep(1000);
        csSpinner.stop();
        const result =  await csharpBasedDockerfileGenerator(content);
        csSpinner.success('Dotnet dockerfile generated successfully')
        console.log("\n\n")
        console.log(result)
        console.log("\n\n")
    }
}

export default dockerfileGenerator; 