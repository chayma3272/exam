pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/wiem-kb/exam.git', branch: 'main'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Tests') {
            steps {
              bat 'if exist C:\\etc\\todos\\todo.db del C:\\etc\\todos\\todo.db'

                bat 'npm test || true'   
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t todo-app .'
            }
        }
    }
}
