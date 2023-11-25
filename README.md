# jira-clone application

## View demo of application

    ->download DEMO.mov file (from github)
        -should cover most of the use cases


## Deployed on render.com

https://jira-clone-305b.onrender.com
 

## Features/Use cases

-Regular users

	->Register    
	->Login 
	->View projects
	->View tasks
	->Kanban functionality (drag and drop feature)
		-can NOT move to ‘Completed’ status if not admin

-Admin user

	->Add project 
	->Edit project
	->Delete project 
	->Add task
	->Edit Task 
	->Delete task 
	->Kanban functionality 
	

## How to run  locally 

1. Create DB with following tables: 

    ->users, tasks, projects 
    
2. Create following .env file in root folder containing following:

MONGO_URI =   (your mongodb connection string)

JWT_KEY =  (some string)

CLOUDINARY_CLOUD_NAME =  (your cloudinary creds)

CLOUDINARY_API_KEY= 

CLOUDINARY_SECRET_KEY=  

PORT =  5001

NODE_ENV=  'development'

3. Run 'npm i' in root folder, and 'npm i --force' in front end folder

4. Run 'npm run dev' in root folder

