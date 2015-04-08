# SharedNodeEnv
A Node.js library designed to handle the creation of shared Environment Variables within multiple node applications running on the same server 
and sharing identical environmental variables that must be updated across all applications when changed. 

The library also allows for a application specific local environments variable file to be created that holds
environment variables that are specific to that application. If the local environments variable file contains any
entries that are identical to those in the shared file, the local variables will take precedence, effectively overriding
the shared variable with the local value.
 
## Installation

    npm install shared-node-env --save
    
## Configuration
The library can accept an optional configuration object that defines two optional configuration values.

#### Format

    {
        sharedEnv: 'path-to-shared-env-file/.env-shared', // default = undefined
        localEnv: 'path-to-local-env-file/.env-local',    // default = '.env-local'
        local: true                                       // default = true
    }
    
##### sharedEnv
Specifies the absolute path to the shared environment variables file.
The file must be named .env-shared and can be located anywhere on the server's file system so long as all Node.js applications
that utilize the shared environment variables can access it.
    
##### localEnv  
Specifies the absolute path to the local environment variables file. This file is meant to be application specific and should only be loaded by a single application. This value ONLY needs to be passed in if the local file is not located in the 
default location at the root of the Node.js application. No matter where the file is located it must be named .env-local.

##### local
Because the library assumes the existence of a local environments file the ability to turn off local is premitted through
this configuration value. This is extremely useful when a shared environments file exists but a local does not for a 
specific application. When set to false the library will not process a local environments file even if one exists.

##### Notes:
Being that the two environment files will be opened and read by this library, it is important that the user account under
which the Node.js application is running has sufficient permissions to open and read them.

## Logic
The library first checks to see if a config object has been provided, if not the library assumes it is being used to 
manage a local environments file and will attempt to load .env-local from the root of the Node.js application.

If a confuguration file is provided the library will check for each of the optional config keys and process each one in order starting with the shared env file and then the local. It is for this reason the local will overwrite values provided by the shared env file.

If local is disabled only the shared environment file will be processed.
    
## Potential Errors
If neither a local file nor a shared file is found the library will throw an error. This is due to the fact that the library is being executed within your Node.js application and expects to perform the task it was created for.

If either the shared or the local environments file being passed is not named correctly an error will be thrown.

If either the shared or the local environments file is empty an error will be thrown.

If either the shared or the local environments file is poorly formatted an error will be thrown.