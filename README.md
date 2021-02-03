# openMic App Server-side

##### by MANSA SAMLAFO 

![Image](./asset/openmic-logo-lg.png "icon") 

## Table of Contents
- [About openMic](#About_openMic)
- [Built With](#Built_with)
- [Project Planning](#Project_Planning)
- [Key Features](#Key_Planning)
- [Run app on Computer](#Run_app_on_Computer)
- [Planning Tools](#Planning_Tools)

### About openMic
openMic is a poetry app or media, built to share and showcase poetic talent of all kinds.

### Built With
---------------
1. Node: Was used to build the server
2. PostGres: For storing all the data from the app.
3. Postman: For testing all app endpoints.

## Project Planning:
Trello was for the planning of the app. This listed the different stages and tasks worked through progressively. Through the use of diagram.io, the flow of information and the different components that currently exist in the react front end was created.

## Key Features
In the building of the server, JSON Web Token was used to encrypt the password and bcrypt was used to hash the password. Both of these help improve the security of the application and minimize unauthorized processes from users.

To ensure that all requests to the different endpoints where responded to, different conditions and scenarios were considered and responses provided. To make room for handling exceptions, try...catch statements where used at every endpoint.

## Run app on Computer
### Prerequisite: 
Ensure you have the following installed: 
1. NodeJS
2. Postgresql 
3. PGAdmin (or any other preferred sql client)

### Setup
To successfully clone the application on your computer follow the below instructions:
1. Copy the link to the project from GitHub.
2. In Visual Studio open up command prompt(for mac) or powershell(for windows computer) type the command "git clone" in your terminal and paste the link next to the words.
3. Change directory into the project folder created.
4. Run the command "npm init" in the folder created.
5. Then run "npm install".
6. Create a .env file at the root of the folder.
7. Update the .env file with the following: DATABASE_URL for Postgres, JWT_SECRET and PORT, and CLOUDINARY_SECRET.
8. Run npm install and npm start to connect to the database and to start the app.
9. Open PgAdmin, right click servers and select the create and then the server option.
10. Give your server a name. Click save.


### Planning tools

* Click [openMic diagram.io flow diagram](https://app.diagrams.net/#G1YaAGBeguXZqIiQGxvRm6kFtjt595oe96)

* Click [openMic Tello board](https://trello.com/b/SnWtS2Li/openmic)

                                 
                                <Elevenfifty Academy © MDS 2021>
                                 