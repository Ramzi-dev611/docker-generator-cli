import inquirer from 'inquirer';
import mustache from 'mustache';
import { createSpinner } from 'nanospinner';
import { sleep } from './utilities/sleep.js';
import chalk from 'chalk';
import {
    serviceTypes, 
    dbServices, 
    databaseVisualizers, 
    queuesServices, 
    readServiceTemplate, 
    readExtraTemplate, 
    extraTemplates ,
    queuesVisualizers,
    applicationServices
} from './utilities/getDockerComposeTemplate.js';

const readEnvironmentVariables = async (num = 0) => {
    if(num === 0) {
        return '';
    }
    let template = await readExtraTemplate(extraTemplates.env);
    let elements = '';
    for (let index = 0; index < num; index++) {
        const answers = await inquirer.prompt([
            {
                name: 'name',
                message: 'what is the environment variable name?',
                type: 'input'
            },
            {
                name: 'value',
                message: 'what is the environment variable value?',
                type: 'input'
            }
        ]);
        const tmp = await readExtraTemplate(extraTemplates.envVar);
        elements+=mustache.render(tmp, answers);
    }
    return mustache.render(template, {environment: elements})
}

const readPorts = async (num = 0) => {
    if (num === 0) {
        return '';
    }
    let template = await readExtraTemplate(extraTemplates.ports);
    let elements = '';
    for (let index = 0; index < num; index++) {
        const answers = await inquirer.prompt([
            {
                name: 'host_port',
                message: 'what is the host port?',
                type: 'number'
            },
            {
                name: 'container_port',
                message: 'what is the container port?',
                type: 'number'
            }
        ]);
        const tmp = await readExtraTemplate(extraTemplates.portMapping);
        elements += mustache.render(tmp, answers);
    }
    return mustache.render(template, { ports: elements })
}

const createPostgresService = async () => {
    let volume = '', service = '', pgadmin_service= '';
    const answers = await inquirer.prompt([
        {
            name: 'service_name',
            message: 'What is the service name you want to use?',
            type: 'input',
            default: 'postgres'
        },
        {
            name: 'container_name',
            message: 'What is the container name you want to use?',
            type: 'input',
            default: 'postgres'
        },
        {
            name: 'hostname',
            message: 'What is the hostname you want to use?',
            type: 'input',
            default: 'postgres'
        },
        {
            name: 'database_version',
            message: 'What version of postgres you want to use?',
            type: 'list',
            choices: ['16.1', '15.5', '14.10']
        },
        {
            name: 'database_user',
            message: 'What is the username for the database server?',
            type: 'input',
            default: 'postgres'
        },
        {
            name: 'database_password',
            message: 'What is the password for the database server?',
            type: 'input',
            default: 'postgres'
        },
        {
            name: 'database_port',
            message: 'What is the port for the database server?',
            type: 'number',
            default: 5432
        },
        {
            name: 'with_visualizer',
            message: 'Would you like to include a visualizing service (pgadmin)?',
            type: 'confirm',
        },
    ]);
    if(answers.with_visualizer) {
        const visAnswers = await inquirer.prompt([
            {
                name: 'container_name',
                message: 'What is the container name you want to use?',
                type: 'input',
                default: 'pgadmin'
            },
            {
                name: 'pgadmin_email',
                message: 'What email you will use to authenticate to the pgadmin dashboard?',
                type: 'input',
                default: 'admin@admin.com'
            },
            {
                name: 'pgadmin_password',
                message: 'What password you will use to authenticate to the pgadmin dashboard',
                type: 'input',
                default: 'root'
            },
            {
                name: 'port',
                message: 'What is the port for the pgadmin dashboard?',
                type: 'number',
                default: 8000
            },
        ]);
        const visTemplate = await readServiceTemplate(serviceTypes.db, databaseVisualizers.pgadmin);
        pgadmin_service = mustache.render(visTemplate, { ...visAnswers, database_service: answers.service_name })
    }
    const serviceTemplate = await readServiceTemplate(serviceTypes.db, dbServices.postgres);
    service = mustache.render(serviceTemplate, { ...answers, pgadmin_service });
    volume = await readExtraTemplate(extraTemplates.postgresVolume);
    return { volume, service };
}

const createMongodbService = async () => {
    let volume = '', service = '', mongo_express = '';
    const answers = await inquirer.prompt([
        {
            name: 'service_name',
            message: 'What is the service name you want to use?',
            type: 'input',
            default: 'mongo'
        },
        {
            name: 'container_name',
            message: 'What is the container name you want to use?',
            type: 'input',
            default: 'mongo'
        },
        {
            name: 'hostname',
            message: 'What is the hostname you want to use?',
            type: 'input',
            default: 'mongo'
        },
        {
            name: 'database_version',
            message: 'What version of mongodb you want to use?',
            type: 'list',
            choices: ['7.0.4', '7.0', '6.0.14']
        },
        {
            name: 'database_user',
            message: 'What is the username for the database server?',
            type: 'input',
            default: 'root'
        },
        {
            name: 'database_password',
            message: 'What is the password for the database server?',
            type: 'input',
            default: 'root'
        },
        {
            name: 'database_port',
            message: 'What is the port for the database server?',
            type: 'number',
            default: 27017
        },
        {
            name: 'with_visualizer',
            message: 'Would you like to include a visualizing service (mongo-express)?',
            type: 'confirm',
        },
    ]);
    if (answers.with_visualizer) {
        const visAnswers = await inquirer.prompt([
            {
                name: 'container_name',
                message: 'What is the container name you want to use?',
                type: 'input',
                default: 'mongo-express'
            },
            {
                name: 'port',
                message: 'What is the port for the pgadmin dashboard?',
                type: 'number',
                default: 8001
            },
        ]);
        const visTemplate = await readServiceTemplate(serviceTypes.db, databaseVisualizers.mongoExpress);
        mongo_express = mustache.render(
            visTemplate, 
            { 
                ...visAnswers, 
                database_service: answers.service_name,
                database_user: answers.database_user,
                database_password: answers.database_password,
                database_port: answers.database_port,
            },
        )
    }
    const serviceTemplate = await readServiceTemplate(serviceTypes.db, dbServices.mongodb);
    service = mustache.render(serviceTemplate, { ...answers, mongo_express });
    volume = await readExtraTemplate(extraTemplates.mongoVolume);
    return { volume, service };
}

const createMysqlService = async () => {
    let volume = '', service = '';
    const answers = await inquirer.prompt([
        {
            name: 'service_name',
            message: 'What is the service name you want to use?',
            type: 'input',
            default: 'mysql'
        },
        {
            name: 'container_name',
            message: 'What is the container name you want to use?',
            type: 'input',
            default: 'mysql'
        },
        {
            name: 'hostname',
            message: 'What is the hostname you want to use?',
            type: 'input',
            default: 'mysql'
        },
        {
            name: 'database_version',
            message: 'What version of mongodb you want to use?',
            type: 'list',
            choices: ['8.2.0', '8.0.35', '5.7.44', '5']
        },
        {
            name: 'database_database',
            message: 'What is the name of the default database?',
            type: 'input',
            default: 'defaultDB'
        },
        {
            name: 'database_user',
            message: 'What is the username for the database server?',
            type: 'input',
            default: 'user'
        },
        {
            name: 'database_password',
            message: 'What is the password for the database server?',
            type: 'input',
            default: 'root'
        },
        {
            name: 'database_root_password',
            message: 'What is the password for the root user of the database server?',
            type: 'input',
            default: 'root'
        },
        {
            name: 'database_port',
            message: 'What is the port for the database server?',
            type: 'number',
            default: 3306
        },
    ]);
    const serviceTemplate = await readServiceTemplate(serviceTypes.db, dbServices.mysql);
    service = mustache.render(serviceTemplate, answers);
    volume = await readExtraTemplate(extraTemplates.mysqlVolume);
    return { volume, service };
}

const createDbService = async () => {
    let service = '', volume = '';
    const dbType = (await inquirer.prompt({
        name: 'dbType',
        message: 'Select the type of the database',
        type: 'list',
        choices: Object.values(dbServices)
    })).dbType;
    let call = {};
    switch (dbType) {
        case dbServices.mysql:
            call = await createMysqlService();
            service = call.service
            volume = call.volume;
            break;
        case dbServices.postgres:
            call = await createPostgresService();
            service = call.service
            volume = call.volume;
            break;
        case dbServices.mongodb:
            call = await createMongodbService();
            service = call.service
            volume = call.volume;            
            break;
    }
    return {service, volume};
}

const createRedisService = async () => {
    let volume = '', service = '', redis_commander = '';
    const answers = await inquirer.prompt([
        {
            name: 'service_name',
            message: 'What is the service name you want to use?',
            type: 'input',
            default: 'redis'
        },
        {
            name: 'container_name',
            message: 'What is the container name you want to use?',
            type: 'input',
            default: 'redis'
        },
        {
            name: 'hostname',
            message: 'What is the hostname you want to use?',
            type: 'input',
            default: 'redis'
        },
        {
            name: 'queue_version',
            message: 'What version of redis you want to use?',
            type: 'list',
            choices: ['7.2.3', '6.2.14', '6.0.20']
        },
        {
            name: 'queue_port',
            message: 'What is the port for the redis server?',
            type: 'number',
            default: 6379
        },
        {
            name: 'with_visualizer',
            message: 'Would you like to include a visualizing service (redis-commander)?',
            type: 'confirm',
        },
    ]);
    if (answers.with_visualizer) {
        const visAnswers = await inquirer.prompt([
            {
                name: 'container_name',
                message: 'What is the container name you want to use?',
                type: 'input',
                default: 'redis-commander'
            },
            {
                name: 'redis_commander_user',
                message: 'What email you will use to authenticate to the redis-commander dashboard?',
                type: 'input',
                default: 'root'
            },
            {
                name: 'redis_commander_password',
                message: 'What password you will use to authenticate to the redis-commander dashboard',
                type: 'input',
                default: 'root'
            },
            {
                name: 'port',
                message: 'What is the port for the redis-commander dashboard?',
                type: 'number',
                default: 8003
            },
        ]);
        const visTemplate = await readServiceTemplate(serviceTypes.queues, queuesVisualizers.redisCommander);
        redis_commander = mustache.render(
            visTemplate, 
            { 
                ...visAnswers, 
                redis_service: answers.service_name,
                redis_hostname: answers.hostname,
                redis_port: answers.queue_port,
            }
        )
    }
    const serviceTemplate = await readServiceTemplate(serviceTypes.queues, queuesServices.redis);
    service = mustache.render(serviceTemplate, { ...answers, redis_commander });
    volume = await readExtraTemplate(extraTemplates.redisVolume);
    return { volume, service };
}

const createKafkaService = async () => {
    let volume = '', service = '', kafka_ui = '';
    const answers = await inquirer.prompt([
        {
            name: 'service_name',
            message: 'What is the service name you want to use?',
            type: 'input',
            default: 'kafka'
        },
        {
            name: 'container_name',
            message: 'What is the container name you want to use?',
            type: 'input',
            default: 'kafka'
        },
        {
            name: 'hostname',
            message: 'What is the hostname you want to use?',
            type: 'input',
            default: 'kafka'
        },
        {
            name: 'queue_port',
            message: 'What is the port for the kafka server?',
            type: 'number',
            default: 9092
        },
        {
            name: 'with_visualizer',
            message: 'Would you like to include a visualizing service (kafka-ui)?',
            type: 'confirm',
        },
    ]);
    if (answers.with_visualizer) {
        const visAnswers = await inquirer.prompt([
            {
                name: 'container_name',
                message: 'What is the container name you want to use?',
                type: 'input',
                default: 'kafka-ui'
            },
            {
                name: 'port',
                message: 'What is the port for the kafka-ui dashboard?',
                type: 'number',
                default: 8004
            },
        ]);
        const visTemplate = await readServiceTemplate(serviceTypes.queues, queuesVisualizers.redisCommander);
        kafka_ui = mustache.render(
            visTemplate,
            {
                ...visAnswers,
                queue_service: answers.service_name,
                queu_host: answers.hostname,
                queue_port: answers.queue_port,
            }
        )
    }
    const serviceTemplate = await readServiceTemplate(serviceTypes.queues, queuesServices.kafka);
    service = mustache.render(serviceTemplate, { ...answers, kafka_ui });
    return { volume, service };
}

const createRabbitmqService = async () => {
    let service = '';
    const answers = await inquirer.prompt([
        {
            name: 'service_name',
            message: 'What is the service name you want to use?',
            type: 'input',
            default: 'rabbit-mq'
        },
        {
            name: 'container_name',
            message: 'What is the container name you want to use?',
            type: 'input',
            default: 'rabbit-mq'
        },
        {
            name: 'hostname',
            message: 'What is the hostname you want to use?',
            type: 'input',
            default: 'rabbit-mq'
        },
        {
            name: 'queue_version',
            message: 'What is the version of rabbit mq you want to use?',
            type: 'list',
            choices: ['3.13-rc', '3.12.10', '3.11.26', '3.9.29']
        },
        {
            name: 'queue_port',
            message: 'What is the port for the rabbitmq server?',
            type: 'number',
            default: 5672
        },
        {
            name: 'queue_ui_port',
            message: 'What is the port for the rabbitmq dashboard?',
            type: 'number',
            default: 15672
        },
    ]);
    const serviceTemplate = await readServiceTemplate(serviceTypes.queues, queuesServices.rabbitmq);
    service = mustache.render(serviceTemplate, answers);
    return { volume: '', service };
}

const createQueueService = async () => {
    let service = '', volume = '';
    const queueType = (await inquirer.prompt({
        name: 'queueType',
        message: 'Select the type of the queue',
        type: 'list',
        choices: Object.values(queuesServices)
    })).queueType;
    let call = {};
    switch (queueType) {
        case queuesServices.kafka:
            call = await createKafkaService();
            service = call.service
            volume = call.volume;
            break;
        case queuesServices.redis:
            call = await createRedisService();
            service = call.service
            volume = call.volume;
            break;
        case queuesServices.rabbitmq:
            call = await createRabbitmqService();
            service = call.service
            volume = call.volume;
            break;
    }
    return { service, volume };
}

const createAppService = async () => {
    const appType = (await inquirer.prompt({
        name: 'appType',
        message: 'Select the type of the application',
        type: 'list',
        choices: Object.values(applicationServices)
    })).appType;
    const template = await readServiceTemplate(serviceTypes.apps, appType);
    let answersSpec = {};
    if(appType === applicationServices.build) {
        answersSpec = await inquirer.prompt([
            {
                name: 'context',
                message: 'what is the build context?',
                type: 'input',
                default: '.'
            },
            {
                name: 'dockerfile',
                message: 'what is the dockerfile name?',
                type: 'input',
                default: 'dockerfile'
            }
        ]);
    } else {
        answersSpec = await inquirer.prompt({
            name: 'image',
            message: 'what is the image name',
            type: 'input'
        });
    }
    const answers = await inquirer.prompt([
        {
            name: 'service_name',
            message: 'what is the service name?',
            type: 'input'
        },
        {
            name: 'container_name',
            message: 'what is the container name?',
            type: 'input'
        },
        {
            name: 'nb_envVar',
            message: 'how many environment variables do you want to specify?',
            type: 'number'
        },
    ]);
    const environment_variables = await readEnvironmentVariables(answers.nb_envVar);
    const nbPorts = (await inquirer.prompt({
        name: 'nb_Ports',
        message: 'how many port mapping do you want to specify?',
        type: 'number'
    })).nb_Ports;
    const ports = await readPorts(nbPorts);
    return { 
        service: mustache.render(template, {
            ...answers,
            ...answersSpec,
            environment_variables,
            ports
        }),
        volume: ''
     }
}

const generateDockerComposeFile = async () => {
    console.clear();
    console.log(`This is the docker compose Generation module. The main purpose of this module is to help you with managing your applications stack and on docker compose by helping you create the docker compose manifest`);
    console.log(chalk.gray('Notice: some features of the dokcer compose are not included in this module'))
    console.log(chalk.gray("Remember, it's a starter generator and if you want to go through further customizations, refer to the documentation of docker compose"))
    const spinner = createSpinner('Docker compose generator').start();
    await sleep(1000);
    spinner.stop();
    const numberOfServices = (await inquirer.prompt({
        name: 'nb',
        type: "number",
        message: 'How many service do you want to include in your docker-compose?',
        default: 1
    })).nb;
    let servicesOutput = '', volumesOutput = '';
    for (let index = 0; index < numberOfServices; index++) {
        const serviceType = (await inquirer.prompt({
            name: 'type',
            message: `Service ${index +1} is of what kind?`,
            type: 'list',
            choices: Object.values(serviceTypes),
        })).type;
        let call = {}
        switch (serviceType) {
            case serviceTypes.db:
                call = await createDbService();
                servicesOutput+=call.service;
                volumesOutput+=call.volume;
                break;
            case serviceTypes.queues:
                call = await createQueueService();
                servicesOutput += call.service;
                volumesOutput += call.volume;
                break;
            case serviceTypes.apps:
                call = await createAppService();
                servicesOutput += call.service;
                volumesOutput += call.volume;
                break;
        }
        const generatorSpinner = createSpinner(`Service ${index+1} generation in progress`).start();
        await sleep(1000);
        generatorSpinner.stop();
    }
    const template = await readServiceTemplate();
    const response = mustache.render(template, { volumes: volumesOutput, services: servicesOutput });
    console.log('\n\n');
    console.log(chalk.green(response));
    console.log('\n\n');
}

export default generateDockerComposeFile;
