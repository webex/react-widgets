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

def warn = { msg ->
  if (!currentBuild.description) {
    currentBuild.description += ''
  }
  else if (currentBuild.description.substring(currentBuild.description.length() - 1) != '\n') {
    currentBuild.description += '<br />\n'
  }
  currentBuild.description += "warning: ${msg}<br />\n"
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

            sshagent(['d8533977-c4c5-4e2b-938d-ae7fcbe27aac']) {
              // return the exit code because we don't care about failures
              sh script: 'git remote add upstream git@github.com:webex/react-ciscospark.git', returnStatus: true
              // Make sure local tags don't include failed releases
              sh 'git tag -l | xargs git tag -d'
              sh 'git gc'
              sh 'git fetch upstream --tags'
            }

            changedFiles = sh script: 'git diff --name-only upstream/master..$(git merge-base HEAD upstream/master)', returnStdout: true
            if (changedFiles.contains('Jenkinsfile')) {
              currentBuild.description += "Jenkinsfile has been updated in master. Please rebase and push again."
              error(currentBuild.description)
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
              sh 'echo \'//registry.npmjs.org/:_authToken=${NPM_TOKEN}\' >> .npmrc'
              sh '''#!/bin/bash -ex
              source ~/.nvm/nvm.sh
              nvm install v8.9.1
              nvm use v8.9.1
              npm install
              git checkout .npmrc
              '''
            }
          }

          stage('Static Analysis') {
            withCredentials([
              string(credentialsId: 'NPM_TOKEN', variable: 'NPM_TOKEN')
            ]) {
              sh '''#!/bin/bash -ex
              source ~/.nvm/nvm.sh
              nvm use v8.9.1
              npm run static-analysis
              '''
            }
          }

          stage('Unit Tests') {
            withCredentials([
              string(credentialsId: 'NPM_TOKEN', variable: 'NPM_TOKEN')
            ]) {
              sh '''#!/bin/bash -ex
              source ~/.nvm/nvm.sh
              nvm use v8.9.1
              npm run jest
              '''
            }
          }

          stage('Journey Tests') {
            withCredentials([
              string(credentialsId: 'ddfd04fb-e00a-4df0-9250-9a7cb37bce0e', variable: 'CISCOSPARK_CLIENT_SECRET'),
              usernamePassword(credentialsId: 'SAUCE_LABS_VALIDATED_MERGE_CREDENTIALS', passwordVariable: 'SAUCE_ACCESS_KEY', usernameVariable: 'SAUCE_USERNAME'),
              string(credentialsId: 'CISCOSPARK_APPID_SECRET', variable: 'CISCOSPARK_APPID_SECRET'),
            ]) {
             sh '''#!/bin/bash -ex
             source ~/.nvm/nvm.sh
             nvm use v8.9.1
             NODE_ENV=test npm run build:package widget-space && npm run build:package widget-recents
             CISCOSPARK_CLIENT_ID=C873b64d70536ed26df6d5f81e01dafccbd0a0af2e25323f7f69c7fe46a7be340 SAUCE=true PORT=4569 SAUCE_CONNECT_PORT=5006 BROWSER=firefox npm run test:integration &
             sleep 60 && CISCOSPARK_CLIENT_ID=C873b64d70536ed26df6d5f81e01dafccbd0a0af2e25323f7f69c7fe46a7be340 SAUCE=true PORT=4568 SAUCE_CONNECT_PORT=5005 BROWSER=chrome npm run test:integration &
             sleep 120 && CISCOSPARK_CLIENT_ID=C873b64d70536ed26df6d5f81e01dafccbd0a0af2e25323f7f69c7fe46a7be340 SAUCE=true PORT=4567 SAUCE_CONNECT_PORT=5004 BROWSER=chrome PLATFORM="windows 10" npm run test:integration &
             wait
             '''
             archiveArtifacts 'reports/**/*'
             junit '**/reports/junit/wdio/*.xml'
            }
          }

          stage('Bump version'){
            sh '''#!/bin/bash -ex
            source ~/.nvm/nvm.sh
            nvm use v8.9.1
            git diff
            npm run release -- --release-as patch --no-verify
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
              sh '''#!/bin/bash -ex
              source ~/.nvm/nvm.sh
              nvm use v8.9.1
              version=`cat .version`
              NODE_ENV=production
              BUILD_PUBLIC_PATH="https://code.s4d.io/widget-space/archives/${version}/" npm run build:package widget-space
              BUILD_PUBLIC_PATH="https://code.s4d.io/widget-space/archives/${version}/" npm run build sri widget-space
              BUILD_BUNDLE_PUBLIC_PATH="https://code.s4d.io/widget-space/archives/${version}/" BUILD_PUBLIC_PATH="https://code.s4d.io/widget-space/archives/${version}/demo/" npm run build:package widget-space-demo
              BUILD_PUBLIC_PATH="https://code.s4d.io/widget-recents/archives/${version}/" npm run build:package widget-recents
              BUILD_PUBLIC_PATH="https://code.s4d.io/widget-recents/archives/${version}/" npm run build sri widget-recents
              BUILD_BUNDLE_PUBLIC_PATH="https://code.s4d.io/widget-recents/archives/${version}/" BUILD_PUBLIC_PATH="https://code.s4d.io/widget-recents/archives/${version}/demo/" npm run build:package widget-recents-demo
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

            archive 'packages/node_modules/@ciscospark/widget-space/dist/**/*'
            archive 'packages/node_modules/@ciscospark/widget-recents/dist/**/*'
            archive 'packages/node_modules/@ciscospark/widget-space-demo/dist/**/*'
            archive 'packages/node_modules/@ciscospark/widget-recents-demo/dist/**/*'


            stage('Push to github'){
              sshagent(['d8533977-c4c5-4e2b-938d-ae7fcbe27aac']) {
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
                  // Copy & update config file
                  sh 'cp .npmrc $HOME/.npmrc'
                  sh 'echo \'//registry.npmjs.org/:_authToken=${NPM_TOKEN}\' >> $HOME/.npmrc'
                  // Publish
                  echo ''
                  echo 'Reminder: E403 errors below are normal. They occur for any package that has no updates to publish'
                  echo ''
                  sh '''#!/bin/bash -ex
                  source ~/.nvm/nvm.sh
                  nvm use v8.9.1
                  npm run publish:components
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
