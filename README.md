# Docker init CLI

This repository containes the source code of a cli tool created to help it's users create and manage dockerfiles and docker compose files when needed

## Usages

For the moment since the tool is still being created and not yet pushed to npm registry, youcna download the source code from here, install dependecies using:

```bash
> npm install
```

and than run the cli using the command

```bash
> npm start
```

## Available functionalities

The cli tool aims to provide it's users the ability to help generate dockerfiles and docker-compose files needed for dockerizing applicatioons and testing systems in local environments

### Dockerfiles

the cli will provide it's users the ability to create dockerfiles for most of the known project types with the ability to customize the stages of building the image, and including a variety of docker base images and steps

The project types that it will handle for a first release are :

* Javascript front and backend applications of different types of frameworks (React, Angular, Vue, Express, Nest, ...)

* Java applications, from J2EE applications to Spring and Spring Boot applications

* C# applications created in .Net framework

### Docker-compose

The cli will provide the users the ability to deside the number of services desired in the docker compose file, their types and their caracteristics (setting environment variables, attaching volumes and creating virtual networks)

## Roadmap

The goal is to create a useful tool to help minimize the effort of research each time of how to dockerize applications and push the tool to the public in npm registry

Once this goal is achieved, adding more features to the cli tool is an option
