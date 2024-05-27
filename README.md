# Sellwell: Online Auction Website
## Introduction
This project implements an online auction platform where users can register, list items for bidding, and participate in auctions with a deadline to bid. We used the MERN stack (MongoDB, Express, React, and
NodeJS) to build this application.
## Tech Stack
#### Frontend : React
#### Backend : Node, Express
#### Database : Moongoose Atlas
#### DevOps Pipeline: Jenkins with Docker, Ansible, and Kubernetes
#### Logging: ELK
## How to Reproduce
Clone: https://github.com/stsiyer/auction-spe-project.git

Change the name of .sampleenv to .env

In CONNECTION_STRING= give your database connection string from MongoDB Atlas.

## Run Backend
``` bash
cd backend
npm start
```
## Run Frontend
1. Open new terminal in project folder then execute
 ```bash
cd frontend
npm start
```
### Jenkins
[Setup Jenkins](https://www.jenkins.io/doc/book/installing/)
### Docker
1. [Setup Docker](https://docs.docker.com/engine/install/)
2. Create a Dockerhub account.
3. Configure dockerhub credentials in Jenkins.
