pipeline {
    agent any
    environment {
        DEPLOY_ENV = ''
    }

    stages {
        stage('Build') {
            steps {
                script {
                    try {
                        if (env.BRANCH_NAME == 'main') {
                            DEPLOY_ENV = 'production'
                        } else {
                            DEPLOY_ENV = 'staging'
                        }
                        bat "docker build --build-arg DEPLOY_ENV=${DEPLOY_ENV} -t my-java-app ."
                    } catch (err) {
                        error "Build image failed with error: ${err}"
                    }
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    try {
                        bat "mvn test"
                    } catch (err) {
                        error "Running maven test failed with error: ${err}"
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    try {
                        bat "docker stop my-java-app-${DEPLOY_ENV} || exit 0"
                        bat "docker rm my-java-app-${DEPLOY_ENV} || exit 0"

                        if (DEPLOY_ENV == 'staging') {
                            bat "docker run -d -p 8081:8081 --name my-java-app-${DEPLOY_ENV} my-java-app"
                        } else {
                            bat "docker run -d -p 8082:8082 --name my-java-app-${DEPLOY_ENV} my-java-app"
                        }
                    } catch (err) {
                        error "Deployment to ${DEPLOY_ENV} failed with error: ${err}"
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline completed successfully for ${DEPLOY_ENV}"
        }
        failure {
            echo "Pipeline failed at stage. Check the console output for details."
        }
    }
}
