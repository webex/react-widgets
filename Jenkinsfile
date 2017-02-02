#!groovy
ansiColor('xterm') {
    timestamps {
        timeout(30) {
            node('NODE_JS_BUILDER') {
                
                stage ('Checkout Code'){
                    checkout([$class: 'GitSCM', branches: [[name: '*/master']], 
                    doGenerateSubmoduleConfigurations: false, extensions: [], 
                    submoduleCfg: [], userRemoteConfigs: 
                    [[credentialsId: '6c8a75fb-5e5f-4803-9b6d-1933a3111a34', 
                    url: 'git@github.com:ciscospark/react-ciscospark.git']]])
                }
                
                stage('Build'){
                     sh '''#!/bin/bash -ex
                     source ~/.nvm/nvm.sh
                     nvm use v5
                     npm install
                     npm run build
                    '''
                }
                
                stage('Run Tests'){
                    // Confirm if tests should be part of the build step 
                     //sh '''#!/bin/bash -ex
                     //source ~/.nvm/nvm.sh
                     //nvm use v5
                     //npm install
                     //npm test
                    //'''
                }
                archive 'dist/**/*'
                
                stage('Publish to CDN'){
                    // Need to create job(s) to publish to CDN
                    // If using a single job, job will need to be modified to copy artifacts
                    // in different locations then upload to the correct folder structre on CDN
                    // cdnPublishBuild = build job: 'spark-js-sdk--publish-chat-widget-s3', parameters: [[$class: 'StringParameterValue', name: 'buildNumber', value: currentBuild.number]], propagate: false
                    // if (cdnPublishBuild.result != 'SUCCESS') {
                    // warn('failed to publish to CDN')
                    //}
                }
            }
        }
    }
}
