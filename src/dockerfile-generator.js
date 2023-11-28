import { createSpinner } from "nanospinner";
import inquirer from "inquirer";
import { sleep } from "./utilities/sleep.js";
import getTemplate from './utilities/getTemplate.js'
import Mustache from 'mustache';
import chalk from 'chalk'


const applicationTypes = {
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

const environmentTypes = {
    dev: 'development',
    prod: 'production'
}

const getEnvironmentVariables = async (nbEnv) => {
    let enviroment_entries = "";
    for (let i = 0; i < parseInt(nbEnv); i++) {
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
        enviroment_entries += `ENV ${envVar.env_name}=${envVar.env_value}\n`;
    }
    return enviroment_entries;
} 

const readEnvironment = async () => {
    const environmentTypeAnswer = await inquirer.prompt({
        name: 'application_env',
        message: 'what is the environment that you are trying to create',
        type: 'list',
        choices: Object.values(environmentTypes),
    })
    return environmentTypeAnswer.application_env;
}

const handleDjango = async () => {
    const environment = await readEnvironment();
    let project_name = '';
    if (environment === environmentTypes.dev) {
        project_name = (await inquirer.prompt({
            message: 'What is the project name?',
            name: "project_name",
            type: 'input'
        })).project_name;
    }
    const answers = await inquirer.prompt([
        {
            message: 'What is the version of python you would like to use?',
            name: "python_version",
            type: "list",
            choices: ["3.13", "3.12", "3.10", "3.9", "2.7"]
        },
        {
            name: "port",
            message: "What port do you wish to expose your application on? (default is 3000)",
            type: 'number',
            default: 8000
        },
        {
            message: "How many environment variables you want to define? (default is 0)",
            name: "nb_env",
            type: 'number',
            default: 0
        }
    ]);
    const environment_variables = await getEnvironmentVariables(answers.nb_env);
    const content = await getTemplate(applicationTypes.django, environment);
    return Mustache.render(content, { ...answers, project_name, environment_variables })
}

const handleFastApi = async () => {
    const environment = await readEnvironment();
    const answers = await inquirer.prompt([
        {
            message: 'What is the version of python you would like to use?',
            name: "python_version",
            type: "list",
            choices: ["3.13", "3.12", "3.10", "3.9", "2.7"]
        },
        {
            name: "port",
            message: "What port do you wish to expose your application on? (default is 3000)",
            type: 'number',
            default: 5000
        },
        {
            message: "How many environment variables you want to define? (default is 0)",
            name: "nb_env",
            type: 'number',
            default: 0
        }
    ]);
    const environment_variables = await getEnvironmentVariables(answers.nb_env);
    const content = await getTemplate(applicationTypes.fastApi, environment);
    return Mustache.render(content, { ...answers, environment_variables })
}

const handleFlask = async () => {
    const environment = await readEnvironment();
    const answers = await inquirer.prompt([
        {
            message: 'What is the version of python you would like to use?',
            name: "python_version",
            type: "list",
            choices: ["3.13", "3.12", "3.10", "3.9", "2.7"]
        },
        {
            name: "port",
            message: "What port do you wish to expose your application on? (default is 3000)",
            type: 'number',
            default: 5000
        },
        {
            message: "How many environment variables you want to define? (default is 0)",
            name: "nb_env",
            type: 'number',
            default: 0
        }
    ]);
    const environment_variables = await getEnvironmentVariables(answers.nb_env);
    let path_to_nginx_config = "";
    if (environment === environmentTypes.prod) {
        path_to_nginx_config = (await inquirer.prompt({
            message: "What is the path to the nginx config file you will use?",
            name: "path",
            type: 'input',
        })).path;
    }
    const content = await getTemplate(applicationTypes.flask, environment);
    return Mustache.render(content, { ...answers, environment_variables, path_to_nginx_config })
}

const handleDotnet = async () => {
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
            choices: ["7.0.2", "6.0.13", "6.0.12"]
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
        },
    ]);
    const environment_entries = await getEnvironmentVariables(answers.nb_env);
    const values = {
        dotnet_sdk_version: answers.dotnet_sdk_version,
        aspnet_version: answers.aspnet_version,
        port: answers.port,
        environment_variables: environment_entries
    };
    const content = await getTemplate(applicationTypes.dotNet, 'dockerfile');
    return Mustache.render(content, values);
}

const handleJSClientApp = async (type) => {
    const environment = await readEnvironment();
    const node_version = (await inquirer.prompt({
        message: 'What is the version of node that you are working with?',
        name: "node_version",
        type: "list",
        choices: ["latest", "19", "18", "16"]
    })).node_version;
    let port = '', nginx_version = '';
    if (environment == environmentTypes.dev) {
        port = (await inquirer.prompt({
            name: "port",
            message: "What port do you wish to expose your application on? (default is 3000)",
            type: 'number',
            default: 3000
        })).port;
    } else {
        nginx_version = (await inquirer.prompt({
            message: "What version of nginx you want to use?",
            name: 'nginx_version',
            type: "list",
            choices: ['1.25.3', '1.24.0']
        })).nginx_version;
    }
    const content = await getTemplate(type, environment);
    return Mustache.render(content, { node_version, port, nginx_version });
}

const handleJSServer = async (type) => {
    const environment = await readEnvironment();
    const answers = await inquirer.prompt([
        {
            message: 'What is the version of node that you are working with?',
            name: "node_version",
            type: "list",
            choices: ["latest", "19", "18", "16"]
        }, 
        {
            name: "port",
            message: "What port do you wish to expose your application on? (default is 3000)",
            type: 'number',
            default: 3000
        }, 
        {
            message: "How many environment variables you want to define? (default is 0)",
            name: "nb_env",
            type: 'number',
            default: 0
        }
    ]);
    const environment_variables = await getEnvironmentVariables(answers.nb_env);
    const content = await getTemplate(type, environment);
    return Mustache.render(content, {...answers, environment_variables})
}

const handleSpringBoot = async () => {
    const environment = await readEnvironment();
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
    const enviroment_entries = await getEnvironmentVariables(answers.nb_env);
    const values = {
        mvn_version: answers.mvn_version,
        jdk_version: answers.jdk_version,
        port: answers.port,
        environment_variables: enviroment_entries
    };
    const content = await getTemplate(applicationTypes.springboot, environment)
    return Mustache.render(content, values);
}

const generateDockerFile = async () => {
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
    const generatorSpinner = createSpinner(`dockerfile generation in progress`).start();
    await sleep(1000);
    generatorSpinner.stop();
    const appType = applicationTypeAnswer.application_type;
    let result = '';
    switch (appType) {
        case applicationTypes.angular:
            result = await handleJSClientApp(applicationTypes.angular);
            break;
        case applicationTypes.django:
            result = await handleDjango()
            break;
        case applicationTypes.dotNet:
            result = await handleDotnet();
            break;
        case applicationTypes.fastApi:
            result = await handleFastApi();
            break;
        case applicationTypes.flask:
            result = await handleFlask();
            break;
        case applicationTypes.nestjs:
            result = await handleJSServer(applicationTypes.nestjs);
            break;
        case applicationTypes.next:
            result = await handleJSServer(applicationTypes.next);
            break;
        case applicationTypes.react:
            result = await handleJSClientApp(applicationTypes.react);
            break;
        case applicationTypes.springboot:
            result = await handleSpringBoot();
            break;
        case applicationTypes.vue:
            result = await handleJSClientApp(applicationTypes.vue);
            break;
    }
    generatorSpinner.success(`dockerfile generated successfully`);
    console.log("\n\n")
    console.log(chalk.green(result))
    console.log("\n\n")
} 

export default generateDockerFile;
