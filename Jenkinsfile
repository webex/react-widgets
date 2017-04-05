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

        def packageJsonVersion

        try {
          // We're not currently using structured output, just relying
          // on exict codes, so the build is a success until something
          // throws
          currentBuild.result = 'SUCCESS'

          // Set the description to blank so we can use +=
          currentBuild.description = ''

          env.NPM_CONFIG_REGISTRY = "http://engci-maven-master.cisco.com/artifactory/api/npm/webex-npm-group"

          stage('checkout') {
            checkout scm

            sh 'git config user.email spark-js-sdk.gen@cisco.com'
            sh 'git config user.name Jenkins'

            try {
              pusher = sh script: 'git show --quiet --format=%ae HEAD', returnStdout: true
              currentBuild.description += "Validating push from ${pusher}"
            }
            catch (err) {
              currentBuild.description += 'Could not determine pusher';
            }

            sshagent(['6c8a75fb-5e5f-4803-9b6d-1933a3111a34']) {
              // return the exit code because we don't care about failures
              sh script: 'git remote add upstream git@github.com:ciscospark/react-ciscospark.git', returnStatus: true

              sh 'git fetch upstream'
            }

            sh 'git checkout upstream/master'
            try {
              sh "git merge --ff ${GIT_COMMIT}"
            }
            catch (err) {
              currentBuild.description = 'not possible to fast forward'
              throw err;
            }
          }

          stage('Clean') {
           sh 'rm -rf node_modules'
          }

          stage('Install') {
            withCredentials([
              string(credentialsId: 'NPM_TOKEN', variable: 'NPM_TOKEN')
            ]) {
              sh '''#!/bin/bash -ex
              source ~/.nvm/nvm.sh
              nvm use v6
              echo \'//registry.npmjs.org/:_authToken=${NPM_TOKEN}\' > $HOME/.npmrc
              npm install
              '''
            }
          }

          stage('Static Analysis') {
            sh '''#!/bin/bash -ex
            source ~/.nvm/nvm.sh
            nvm use v6
            npm run static-analysis
            '''
          }

          stage('Test') {
            withCredentials([
              string(credentialsId: 'ddfd04fb-e00a-4df0-9250-9a7cb37bce0e', variable: 'CISCOSPARK_CLIENT_SECRET'),
              usernamePassword(credentialsId: 'SAUCE_LABS_VALIDATED_MERGE_CREDENTIALS', passwordVariable: 'SAUCE_ACCESS_KEY', usernameVariable: 'SAUCE_USERNAME'),
            ]) {
             sh '''#!/bin/bash -ex
             source ~/.nvm/nvm.sh
             nvm use v6
             NODE_ENV=test npm run build:bundle && npm run build:package widget-message-meet
             CISCOSPARK_CLIENT_ID=C873b64d70536ed26df6d5f81e01dafccbd0a0af2e25323f7f69c7fe46a7be340 SAUCE=true npm test
             '''
            }
          }

          stage('Build'){
            withCredentials([usernamePassword(credentialsId: 'MESSAGE_DEMO_CLIENT', passwordVariable: 'MESSAGE_DEMO_CLIENT_SECRET', usernameVariable: 'MESSAGE_DEMO_CLIENT_ID')]) {
              sh '''#!/bin/bash -ex
              source ~/.nvm/nvm.sh
              nvm use v6
              npm run build:bundle && npm run build:package widget-message-meet
              '''
            }
          }

          stage('Check for No Push') {
            try {
              noPushCount = sh script: 'git log upstream/master.. | grep -c "#no-push"', returnStdout: true
              if (noPushCount != '0') {
                currentBuild.result = 'ABORTED'
                currentBuild.description += 'Aborted: git history includes #no-push'
              }
            }
            catch (err) {
              // ignore. turns out that when there are zero #no-push
              // commits, sh throws. This should be improved at some point,
              // but gets the job done for now
            }
          }

          if (currentBuild.result == 'SUCCESS'){
            stage('Bump version'){
              sh '''#!/bin/bash -ex
              source ~/.nvm/nvm.sh
              nvm use v6
              npm version patch
              version=`grep "version" package.json | head -1 | awk -F: '{ print $2 }' | sed 's/[", ]//g'`
              echo $version > .version
              git add package.json
              git commit -m "build $packageJsonVerson"
              git tag -a "v$version" -m "`git log -1 --format=%s`"
              '''
              packageJsonVersion = readFile '.version'
            }

            archive 'packages/node_modules/@ciscospark/widget-message-meet/dist/**/*'
            archive 'dist/**/*'

            stage('Push to github'){
              sshagent(['6c8a75fb-5e5f-4803-9b6d-1933a3111a34']) {
                sh "git push upstream HEAD:master && git push --tags"
              }
            }

            stage('Publish to CDN'){
              cdnPublishBuild = build job: 'publish-spark-js-sdk-react-widget-s3', parameters: [string(name: 'buildNumber', value: "${currentBuild.number}"), string(name: 'versionNumber', value: "${packageJsonVersion}")], propagate: false
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
