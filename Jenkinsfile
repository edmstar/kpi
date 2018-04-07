pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'docker kill kpi-build || true'
        sh 'docker run -d --rm --name kpi-build -it -v ${PWD}:/code node:latest bash'
        sh 'docker exec -w /code kpi-build npm install'
      }
    }
    stage('Test') {
      steps {
        sh 'docker exec -w /code kpi-build npm run test-pipeline'
        junit '${PWD}/test-results.xml'
        sh 'docker kill kpi-build || true'
      }
    }
  }
}