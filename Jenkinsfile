pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'docker stop kpi-build || true && docker rm kpi-build'
        sh 'docker run -d --name kpi-build -it -v ${PWD}:/code node:latest bash'
        sh 'docker exec -w /code kpi-build npm install'
      }
    }
    stage('Test') {
      steps {
        sh 'docker exec -w /code kpi-build npm run test-pipeline'
        junit '${PWD}/test-results.xml'
      }
    }
  }
}