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
    timeout(90) {
      node('NODE_JS_BUILDER') {

        def packageJsonVersion

        try {
          // We're not currently using structured output, just relying
          // on exict codes, so the build is a success until something
          // throws
          currentBuild.result = 'SUCCESS'

          // Set the description to blank so we can use +=
          currentBuild.description = ''

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

            changedFiles = sh script: 'git diff --name-only upstream/master..$(git merge-base HEAD upstream/master)', returnStdout: true
            if (changedFiles.contains('Jenkinsfile')) {
              currentBuild.description += "Jenkinsfile has been updated in master. Please rebase and push again."
              error(currentBuild.description)
            }

            sh 'git checkout upstream/master'
            sh 'git reset --hard && git clean -f'
            sh 'git tag -l | xargs git tag -d'
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
              sh 'echo \'//registry.npmjs.org/:_authToken=${NPM_TOKEN}\' >> .npmrc'
              sh '''#!/bin/bash -e
              source ~/.nvm/nvm.sh &> /dev/null
              nvm install v8.9.4
              nvm use v8.9.4
              npm install
              git checkout .npmrc
              '''
            }
          }

          stage('Static Analysis') {
            sh '''#!/bin/bash -e
            source ~/.nvm/nvm.sh &> /dev/null
            nvm use v8.9.4
            npm run static-analysis
            '''
          }

          stage('Unit Tests') {
            sh '''#!/bin/bash -e
            source ~/.nvm/nvm.sh &> /dev/null
            nvm use v8.9.4
            npm run jest
            '''
          }

          stage('Build for Testing') {
            sh '''#!/bin/bash -e
            source ~/.nvm/nvm.sh &> /dev/null
            nvm use v8.9.4
            export NODE_ENV=test
            cp -r ./test/journeys/server ./dist-test
            BUILD_DIST_PATH="${PWD}/dist-test/dist-space" npm run build:package widget-space
            BUILD_DIST_PATH="${PWD}/dist-test/dist-recents" npm run build:package widget-recents
            cp -r ./node_modules/axe-core ./dist-test/
            '''
          }

          stage('Deploy for Testing') {
            withCredentials([
              string(credentialsId: 'NETLIFY_TOKEN', variable: 'NETLIFY_TOKEN'),
            ]) {
              sh '''#!/bin/bash -e
              source ~/.nvm/nvm.sh &> /dev/null
              nvm use v8.9.4
              npx netlify deploy -t ${NETLIFY_TOKEN}
              '''
            }
          }

          stage('Run Journey Tests') {
            withCredentials([
              string(credentialsId: 'REACT_WIDGETS_CLIENT_ID', variable: 'CISCOSPARK_CLIENT_ID'),
              string(credentialsId: 'REACT_WIDGETS_CLIENT_SECRET', variable: 'CISCOSPARK_CLIENT_SECRET'),
              usernamePassword(credentialsId: 'SAUCE_LABS_VALIDATED_MERGE_CREDENTIALS', passwordVariable: 'SAUCE_ACCESS_KEY', usernameVariable: 'SAUCE_USERNAME'),
            ]) {
             sh '''#!/bin/bash -e
             source ~/.nvm/nvm.sh &> /dev/null
             nvm use v8.9.4
             export JOURNEY_TEST_BASE_URL=https://practical-roentgen-7d4de0.netlify.com
             BROWSER=firefox npm run test:integration:sauce & sleep 60
             BROWSER=chrome npm run test:integration:sauce & sleep 120
             BROWSER=chrome PLATFORM="windows 10" npm run test:integration:sauce & wait
             '''
             junit '**/reports/junit/wdio/*.xml'
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
              sh '''#!/bin/bash -e
              source ~/.nvm/nvm.sh &> /dev/null
              nvm use v8.9.4
              git diff
              npm version patch -m "build %s"
              version=`grep "version" package.json | head -1 | awk -F: '{ print $2 }' | sed 's/[", ]//g'`
              echo $version > .version
              '''
              packageJsonVersion = readFile '.version'
            }

            stage('Build for CDN'){
              withCredentials([
                usernamePassword(credentialsId: 'MESSAGE_DEMO_CLIENT', passwordVariable: 'MESSAGE_DEMO_CLIENT_SECRET', usernameVariable: 'MESSAGE_DEMO_CLIENT_ID'),
                file(credentialsId: 'web-sdk-cdn-private-key', variable: 'PRIVATE_KEY_PATH'),
                string(credentialsId: 'web-sdk-cdn-private-key-passphrase', variable: 'PRIVATE_KEY_PASSPHRASE'),
              ]) {
                sh '''#!/bin/bash -e
                source ~/.nvm/nvm.sh &> /dev/null
                nvm use v8.9.4
                export version=`cat .version`
                export NODE_ENV=production
                BUILD_PUBLIC_PATH="https://code.s4d.io/widget-space/archives/${version}/" npm run build:package widget-space
                BUILD_PUBLIC_PATH="https://code.s4d.io/widget-space/archives/${version}/" npm run build sri widget-space
                BUILD_BUNDLE_PUBLIC_PATH="https://code.s4d.io/widget-space/archives/${version}/" BUILD_PUBLIC_PATH="https://code.s4d.io/widget-space/archives/${version}/demo/" npm run build:package widget-space-demo
                BUILD_PUBLIC_PATH="https://code.s4d.io/widget-recents/archives/${version}/" npm run build:package widget-recents
                BUILD_PUBLIC_PATH="https://code.s4d.io/widget-recents/archives/${version}/" npm run build sri widget-recents
                BUILD_BUNDLE_PUBLIC_PATH="https://code.s4d.io/widget-recents/archives/${version}/" BUILD_PUBLIC_PATH="https://code.s4d.io/widget-recents/archives/${version}/demo/" npm run build:package widget-recents-demo
                '''
              }
            }

            archive 'packages/node_modules/@ciscospark/widget-space/dist/**/*'
            archive 'packages/node_modules/@ciscospark/widget-recents/dist/**/*'
            archive 'packages/node_modules/@ciscospark/widget-space-demo/dist/**/*'
            archive 'packages/node_modules/@ciscospark/widget-recents-demo/dist/**/*'


            stage('Push to github'){
              sshagent(['6c8a75fb-5e5f-4803-9b6d-1933a3111a34']) {
                sh "git push upstream HEAD:master && git push --tags upstream"
              }
            }

            stage('Publish to CDN'){
              cdnPublishBuild = build job: 'publish-spark-js-sdk-react-widget-s3', parameters: [string(name: 'buildNumber', value: "${currentBuild.number}"), string(name: 'versionNumber', value: "${packageJsonVersion}")], propagate: false
              if (cdnPublishBuild.result != 'SUCCESS') {
                warn('failed to publish to CDN')
              }
            }

            stage('Publish to NPM') {
              withCredentials([
                string(credentialsId: 'NPM_TOKEN', variable: 'NPM_TOKEN')
              ]) {
                try {
                  sh 'echo \'//registry.npmjs.org/:_authToken=${NPM_TOKEN}\' >> .npmrc'
                  echo ''
                  echo 'Reminder: E403 errors below are normal. They occur for any package that has no updates to publish'
                  echo ''
                  sh '''#!/bin/bash -e
                  source ~/.nvm/nvm.sh &> /dev/null
                  nvm use v8.9.4
                  npm run publish:components
                  git checkout .npmrc
                  '''
                }
                catch (error) {
                  warn("failed to publish to npm ${error.toString()}")
                }
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
