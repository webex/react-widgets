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
    timeout(120) {
      node('NODE_JS_BUILDER') {

        def packageJsonVersion
        def skipAction
        def skipTests = false

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
              string(credentialsId: 'WIDGETS_NPM_TOKEN', variable: 'WIDGETS_NPM_TOKEN')
            ]) {
              sh 'echo \'//registry.npmjs.org/:_authToken=${WIDGETS_NPM_TOKEN}\' >> .npmrc'
              sh '''#!/bin/bash -e
              source ~/.nvm/nvm.sh
              nvm install v8.15.0
              nvm use v8.15.0
              npm install -g npm@6.4.1
              npm install
              git checkout .npmrc
              '''
            }
          }

          stage('Static Analysis') {
            withCredentials([
              string(credentialsId: 'WIDGETS_NPM_TOKEN', variable: 'WIDGETS_NPM_TOKEN')
            ]) {
              sh '''#!/bin/bash -e
              source ~/.nvm/nvm.sh
              nvm use v8.15.0
              npm run static-analysis
              '''
            }
          }

          stage('Test Skipping Check') {
            echo "checking if tests should be skipped"
            withCredentials([
              string(credentialsId: 'WIDGETS_NPM_TOKEN', variable: 'WIDGETS_NPM_TOKEN')
            ]) {
              sh '''#!/bin/bash -e
              source ~/.nvm/nvm.sh
              nvm use v8.15.0
              action=`npm run --silent tooling -- check-testable`
              echo $action > .action
              '''
              skipAction = readFile '.action'
              if (skipAction.contains('skip')) {
                echo "tests should be skipped"
                skipTests = true
                warn('Bypassing tests according to commit message instruction (or no changes requiring testing)');
              }
              else {
                echo "tests should not be skipped"
              }
            }
          }

          stage('Unit Tests') {
            if (!skipTests) {
              withCredentials([
                string(credentialsId: 'WIDGETS_NPM_TOKEN', variable: 'WIDGETS_NPM_TOKEN')
              ]) {
                sh '''#!/bin/bash -e
                source ~/.nvm/nvm.sh
                nvm use v8.15.0
                npm run jest
                '''
              }
            }
          }

          stage('Bump version') {
            withCredentials([
              string(credentialsId: 'WIDGETS_NPM_TOKEN', variable: 'WIDGETS_NPM_TOKEN')
            ]) {
              sh '''#!/bin/bash -e
              source ~/.nvm/nvm.sh
              nvm use v8.15.0
              npm run release -- --release-as patch --no-verify
              version=`grep "version" package.json | head -1 | awk -F: '{ print $2 }' | sed 's/[", ]//g'`
              echo $version > .version
              git rev-parse HEAD > gitcommit
              '''
              packageJsonVersion = readFile '.version'
            }
          }

          stage('Build for CDN'){
            withCredentials([
              string(credentialsId: 'WIDGETS_NPM_TOKEN', variable: 'WIDGETS_NPM_TOKEN'),
              file(credentialsId: 'web-sdk-cdn-private-key', variable: 'PRIVATE_KEY_PATH'),
              string(credentialsId: 'web-sdk-cdn-private-key-passphrase', variable: 'PRIVATE_KEY_PASSPHRASE'),
            ]) {
              sh '''#!/bin/bash -e
              source ~/.nvm/nvm.sh
              nvm use v8.15.0
              version=`cat .version`
              export NODE_ENV=production
              BUILD_PUBLIC_PATH="https://code.s4d.io/widget-space/archives/${version}/" npm run build:package widget-space
              BUILD_PUBLIC_PATH="https://code.s4d.io/widget-space/archives/${version}/" npm run build sri widget-space
              BUILD_BUNDLE_PUBLIC_PATH="https://code.s4d.io/widget-space/archives/${version}/" BUILD_PUBLIC_PATH="https://code.s4d.io/widget-space/archives/${version}/demo/" npm run build:package widget-space-demo
              BUILD_PUBLIC_PATH="https://code.s4d.io/widget-recents/archives/${version}/" npm run build:package widget-recents
              BUILD_PUBLIC_PATH="https://code.s4d.io/widget-recents/archives/${version}/" npm run build sri widget-recents
              BUILD_BUNDLE_PUBLIC_PATH="https://code.s4d.io/widget-recents/archives/${version}/" BUILD_PUBLIC_PATH="https://code.s4d.io/widget-recents/archives/${version}/demo/" npm run build:package widget-recents-demo
              BUILD_PUBLIC_PATH="https://code.s4d.io/widget-demo/archives/${version}/" npm run build:package widget-demo
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
            archive 'packages/node_modules/@ciscospark/widget-demo/dist/**/*'
            archive 'gitcommit'


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
                string(credentialsId: 'JS_SDK_NPM_PUBLISH_TOKEN', variable: 'NPM_PUBLISH_TOKEN')
              ]) {
                try {
                  sh 'echo \'//registry.npmjs.org/:_authToken=${NPM_PUBLISH_TOKEN}\' >> $HOME/.npmrc'
                  // Publish
                  echo ''
                  echo 'Reminder: E403 errors below are normal. They occur for any package that has no updates to publish'
                  echo ''
                  sh '''#!/bin/bash -e
                  source ~/.nvm/nvm.sh
                  nvm use v8.15.0
                  npm run publish:components
                  rm $HOME/.npmrc
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
