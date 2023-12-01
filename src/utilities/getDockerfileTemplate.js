import fs from 'fs/promises';
import { dirname, resolve }  from 'path';
import { fileURLToPath } from 'url';

const readTemplate = async (type, env) => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const template_path = resolve(__dirname, '..', '..', `templates/dockerfiles/${type}.${env}.template`)
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

export default readTemplate;
