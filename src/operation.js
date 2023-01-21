import inquirer from "inquirer";
import { createSpinner } from "nanospinner";

export const Operationtypes = {
    dockerfile: 'dockerfile',
    dockerCompose: 'docker-compose file',
    exit: 'exit',
}

const operation = async () => {
    const answer = await inquirer.prompt({
        name: 'operation',
        message: 'what service do you need help with?',
        type: "list",
        choices: [
            Operationtypes.dockerfile,
            Operationtypes.dockerCompose,
            Operationtypes.exit
        ]
    })
    return answer.operation;
}

export default operation;