<h1 align="center">jira-clone</h1>

## DEMO!!!

A project management application containing core functionalities of jira app. This app is meant for learning/educational purposes only.

&nbsp;

This should cover most of the features/use cases.

https://youtu.be/5A641Vlgirw

## Deployed on render.com

https://jira-clone-305b.onrender.com

## Features/Use cases

-Regular users

- [x] Register
- [x] Login
- [x] View projects
- [x] View tasks
- [x] Kanban board drag/drop functionality (drag and drop feature)
 

-Admin user

- [x] Add project
- [x] Edit project
- [x] Delete project
- [x] Add task
- [x] Edit Task
- [x] Delete task
 

## How to run locally

1. Create DB in MongoDB Atlas with following tables:

  	 	->users, tasks, projects

2. Create  .env file in root folder containing following:



		MONGO_URI = (your mongodb connection string)

		JWT_KEY = (some string)

		PORT = 5001

		NODE_ENV= 'development'

 

3.  Install dependencies.

    > 'npm i' //in root folder,

    > 'npm i --force' //in front end folder

 

4. START our application!(runs both client and server concurrently)

   > 'npm run dev' //in root folder
