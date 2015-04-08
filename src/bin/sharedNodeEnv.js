/*jslint maxlen: 500 */
/**
 * Created by Tim on 4/8/15.
 */

// Node Libraries
var _ = require('underscore');
var fs = require('fs');
var path = require('path');


// Private Variables
var envSharedFileName = '.env-shared';
var envLocalFileName = '.env-local';
var config, sharedEnvFile, sharedEnv, localEnvFile, localEnv;


// Private Functions

function injectVariables(env){
    // ENV FORMAT
    //[
    //    {
    //        key: 'SERVER_ID',
    //        value: '123456'
    //    },
    //    {
    //        key: 'SYSTEM_TOKEN',
    //        value: 'qwe789asd'
    //    }
    //]

    for(var i=0; i<env.length; i++){
        var variable = env[1];
        process.env[variable.key] = variable.value;
    }
}

function loadLocalEnv(){
    if(_.isUndefined(localEnvFile)){
        return;
    }

    console.log('DEBUG: ' + __dirname);

    var localEnvData = fs.readFileSync(localEnvFile, { encoding: 'utf8', flag: 'r' });

    if(_.isUndefined(localEnvData) || _.isEmpty(localEnvData))
    {
        throw new Error('SharedNodeEnv - Local Env File Error: the shared environment file identified is empty: ' + localEnvFile);
    }

    localEnv = JSON.parse(localEnvData);
    injectVariables(localEnv);
}

function loadSharedEnv(){
    if(_.isUndefined(sharedEnvFile)){
        return;
    }

    var sharedEnvData = fs.readFileSync(sharedEnvFile, { encoding: 'utf8', flag: 'r' });

    if(_.isUndefined(sharedEnvData) || _.isEmpty(sharedEnvData))
    {
        throw new Error('SharedNodeEnv - Shared Env File Error: the shared environment file identified is empty: ' + sharedEnvFile);
    }

    sharedEnv = JSON.parse(sharedEnvData);
    injectVariables(sharedEnv);
}

function verifyConfig(){
    // CONFIG FORMAT
    //{
    //    sharedEnv: 'path-to-shared-env-file/.env-shared', // default = undefined
    //    localEnv: 'path-to-local-env-file/.env-local' // default = './.env-local'
    //}

    console.log('DEBUG: Verifying Config');

    if(_.isUndefined(config)){
        localEnvFile = path.resolve(process.cwd(), envLocalFileName);
        return;
    }

    if(!_.isUndefined(config.sharedEnv) && !_.isEmpty(config.sharedEnv)){
        if(config.sharedEnv.indexOf(envSharedFileName) > -1){
            sharedEnvFile = config.sharedEnv;
        } else {
            throw new Error('SharedNodeEnv - Config Error: Invalid shared environment file specified. File should be named: ' + envSharedFileName);
        }
    }

    if(!_.isUndefined(config.localEnv) && !_.isEmpty(config.localEnv)){
        if(config.localEnv.indexOf(envLocalFileName) > -1){
            localEnvFile = config.localEnv;
        } else {
            throw new Error('SharedNodeEnv - Config Error: Invalid local environment file specified. File should be named: ' + envLocalFileName);
        }
    }
}

function run(conf){
    console.log('DEBUG: Executing SharedNodeEnv');

    config = conf;
    verifyConfig();
    loadSharedEnv();
    loadLocalEnv();
}

module.exports = run;