#!groovy
ansiColor('xterm') {
    timestamps {
        timeout(30) {
            node('NODE_JS_BUILDER') {
                
                def GIT_COMMIT

                def cleanup = { ->
                  // cleanup can't be a stage because it'll throw off the stage-view on the
                  // job's main page

                  // ARCHIVE RELEVANT TEST REPORTS

                  if (currentBuild.result != 'SUCCESS') {
                    withCredentials([usernamePassword(
                      credentialsId: '386d3445-b855-40e4-999a-dc5801336a69',
                      passwordVariable: 'GAUNTLET_PASSWORD',
                      usernameVariable: 'GAUNTLET_USERNAME'
                    )]) {
                      sh "curl -i --user ${GAUNTLET_USERNAME}:${GAUNTLET_PASSWORD} -X PUT 'https://gauntlet.wbx2.com/api/queues/react-ciscospark/master?componentTestStatus=failure&commitId=${GIT_COMMIT}'"
                    }
                  }
                }

                try {
                    
                    stage('checkout') {
                        checkout scm

                        sh 'git config user.email spark-js-sdk.gen@cisco.com'
                        sh 'git config user.name Jenkins'

                        GIT_COMMIT = sh script: 'git rev-parse HEAD | tr -d "\n"', returnStdout: true

                        sh 'git fetch upstream'
                        sh 'git checkout upstream/master'

                        try {
                          sh "git merge --ff ${GIT_COMMIT}"
                        }
                        catch (err) {
                          currentBuild.description = 'not possible to fast forward'
                          throw err;
                        }
                    }

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

                cleanup()

                }

                catch {
                  // Sometimes an exception can get thrown without changing the build result
                  // from success. If we reach this point and the result is not UNSTABLE, then
                  // we need to make sure it's FAILURE
                  if (currentBuild.result != 'UNSTABLE') {
                    currentBuild.result = 'FAILURE'
                  }
                    cleanup()
                    throw error
                }
            }
        }
    }
}
