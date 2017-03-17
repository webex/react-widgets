#!groovy

def cleanup = { ->
    // cleanup can't be a stage because it'll throw off the stage-view on the job's main page
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

ansiColor('xterm') {
    timestamps {
        timeout(60) {
            node('NODE_JS_BUILDER') {
                
                def GIT_COMMIT

                try {
                    currentBuild.result = 'SUCCESS'
                    stage('checkout') {
                        checkout scm

                        sh 'git config user.email spark-js-sdk.gen@cisco.com'
                        sh 'git config user.name Jenkins'

                        GIT_COMMIT = sh script: 'git rev-parse HEAD | tr -d "\n"', returnStdout: true
                        
                        sshagent(['6c8a75fb-5e5f-4803-9b6d-1933a3111a34']) {
                            sh 'git fetch upstream'
                            sh 'git checkout upstream/master'
                        }

                        try {
                            sh "git merge --ff ${GIT_COMMIT}"
                        }
                        catch (err) {
                            currentBuild.description = 'not possible to fast forward'
                            throw err;
                        }
                    }
                    
                    stage('Build'){
                        withCredentials([usernamePassword(credentialsId: 'MESSAGE_DEMO_CLIENT', passwordVariable: 'MESSAGE_DEMO_CLIENT_SECRET', usernameVariable: 'MESSAGE_DEMO_CLIENT_ID')]) {
                            sh '''#!/bin/bash -ex
                            source ~/.nvm/nvm.sh
                            nvm use v6
                            npm install
                            npm run build
                            //grep "version" package.json | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g'
                            '''
                        }
                    }

                    archive 'packages/node_modules/@ciscospark/widget-message-meet/dist/**/*'
                    archive 'dist/**/*'

                    if (currentBuild.result == 'SUCCESS'){
                        stage('Push to github'){
                            sshagent(['6c8a75fb-5e5f-4803-9b6d-1933a3111a34']) {
                                sh "git push upstream HEAD:master"
                            }
                        }

                        stage('Publish to CDN'){
                            cdnPublishBuild = build job: 'publish-spark-js-sdk-react-widget-s3', parameters: [[$class: 'StringParameterValue', name: 'buildNumber', value: "${currentBuild.number}"]], propagate: false
                            if (cdnPublishBuild.result != 'SUCCESS') {
                                warn('failed to publish to CDN')
                            }
                        }
                    }                    
                    cleanup()
                }

                catch (error) {
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
