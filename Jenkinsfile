pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'docker run --rm -d --name build -v $PWD:/code node:latest npm install /code/package.json'
      }
    }
  }
}