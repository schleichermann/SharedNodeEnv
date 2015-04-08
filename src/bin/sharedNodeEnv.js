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

    // .ENV FILE FORMAT
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

    if(_.isUndefined(env)){
        return;
    }

    for(var i=0; i<env.length; i++){
        var variable = env[i];
        process.env[variable.key] = variable.value;
    }
}

function loadLocalEnv(){
    if(_.isUndefined(localEnvFile)){
        return;
    }

    var localEnvData;

    try {
        localEnvData = fs.readFileSync(localEnvFile, {encoding: 'utf8', flag: 'r'});
    } catch (err){
        if(err.code === 'ENOENT'){
            throw new Error('SharedNodeEnv - Local Env File Error: the environment file identified does not exist: ' + localEnvFile);
        } else {
            throw err;
        }
    }


    if(_.isUndefined(localEnvData) || _.isEmpty(localEnvData))
    {
        throw new Error('SharedNodeEnv - Local Env File Error: the environment file identified is empty: ' + localEnvFile);
    }

    try {
        localEnv = JSON.parse(localEnvData);
    } catch(err){
        throw new Error('SharedNodeEnv - Local Env File Error: JSON is badly formatted and cannot be parsed: ' + localEnvFile);
    }

    injectVariables(localEnv);
}

function loadSharedEnv(){
    if(_.isUndefined(sharedEnvFile)){
        return;
    }

    var sharedEnvData;

    try {
        sharedEnvData = fs.readFileSync(sharedEnvFile, {encoding: 'utf8', flag: 'r'});
    } catch(err){
        if(err.code === 'ENOENT'){
            throw new Error('SharedNodeEnv - Shared Env File Error: the environment file identified does not exist: ' + sharedEnvFile);
        } else {
            throw err;
        }
    }


    if(_.isUndefined(sharedEnvData) || _.isEmpty(sharedEnvData))
    {
        throw new Error('SharedNodeEnv - Shared Env File Error: the shared environment file identified is empty: ' + sharedEnvFile);
    }

    try {
        sharedEnv = JSON.parse(sharedEnvData);
    } catch(err){
        throw new Error('SharedNodeEnv - Shared Env File Error: JSON is badly formatted and cannot be parsed: ' + sharedEnvFile);
    }

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
        console.log('Local Env File: ' + localEnvFile);
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
    } else {
        localEnvFile = path.resolve(process.cwd(), envLocalFileName);
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