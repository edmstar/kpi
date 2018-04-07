pipeline {
  agent any
  stages {
    stage('Clean up') {
      steps {
        //sh 'echo y | docker system prune'
        script {
          def sout = new StringBuilder(), serr = new StringBuilder()
          def proc = 'docker ps -a -q --filter name=kpi-build'.execute()
          proc.consumeProcessOutput(sout, serr)
          proc.waitFor()

          if (!sout?.allWhiteSpace) {
            'docker kill kpi-build'.execute().waitFor()
          }
        }
      }
    }
    stage('Build') {
      steps {
        sh 'docker run -d --name kpi-build -it -v $PWD:/code'
        sh 'docker exec kpi-build npm install /code/package.json'
      }
    }
    stage('Test') {
      steps {
        sh 'docker exec kpi-build npm test'
      }
    }
  }
}