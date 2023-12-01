import fs from 'fs/promises';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

export const serviceTypes = {
    db: 'Database',
    queues: 'Queue',
    apps: 'Application'
}

export const dbServices = {
    postgres: 'postgres',
    mongodb: 'mongodb',
    mysql: 'mysql'
}

export const databaseVisualizers = {
    pgadmin: 'pgadmin',
    mongoExpress: 'mongo-express',
}

export const queuesVisualizers = {
    redisCommander: 'redis-commander',
    kafkaUi: 'kafka-ui'
}

export const queuesServices = {
    redis: 'redis',
    kafka: 'kafka',
    rabbitmq: 'rabbit-mq'
}

export const applicationServices = {
    build: 'build',
    fromImage: 'from-image',
}

export const extraTemplates = {
    mongoVolume: 'mongo.volume',
    mysqlVolume: 'mysql.volume',
    postgresVolume: 'postgres.volume',
    redisVolume: 'redis.volume',
    portMapping: 'port-mapping.entry',
    envVar: 'environment-variable.entry',
    ports: 'ports',
    env: 'environment',
}

export const readServiceTemplate = async (type='', service = '') => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const path = type !== '' 
        ? `templates/docker-compose/${type}/${service}.service.template` 
        : 'templates/docker-compose/docker-compose.template';
    const template_path = resolve(__dirname, '..', '..', path)
    let data = '';
    try {
        data = await fs.readFile(template_path, { encoding: 'utf-8' });
        return data;
    } catch (err) {
        console.error('Something went wrong while reading the template file');
        console.dir(err);
        process.exit(1);
    }
}

export const readExtraTemplate = async (fileName) => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const template_path = resolve(__dirname, '..', '..', `templates/docker-compose/Extra/${fileName}.template`);
    let data = '';
    try {
        data = await fs.readFile(template_path, { encoding: 'utf-8' });
        return data;
    } catch (err) {
        console.error('Something went wrong while reading the template file');
        console.dir(err);
        process.exit(1);
    }
}
