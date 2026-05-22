pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'sp23bct016/todo-app'
        DOCKER_TAG   = "${env.BUILD_NUMBER}"
    }

    stages {

        // ── STAGE 1: Code Fetch ──────────────────────────────────
        stage('Code Fetch') {
            steps {
                git branch: 'main',
                    credentialsId: 'github-token',
                    url: 'https://github.com/No-obri/todo-app.git'
                echo 'Code fetched successfully from GitHub.'
            }
        }

        // ── STAGE 2: Docker Image Creation ──────────────────────
        stage('Docker Image Creation') {
            steps {
                script {
                    echo "Building Docker image: ${DOCKER_IMAGE}:${DOCKER_TAG}"
                    dockerImage = docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }

        // ── STAGE 2b: Push to DockerHub ──────────────────────────
        stage('Push to DockerHub') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials') {
                        dockerImage.push("${DOCKER_TAG}")
                        dockerImage.push('latest')
                    }
                    echo "Image pushed to DockerHub successfully."
                }
            }
        }

        // ── STAGE 3: Kubernetes Deployment ───────────────────────
        stage('Kubernetes Deployment') {
            steps {
                script {
                    // Update the image tag in deployment.yaml dynamically
                    sh """
                        sed -i 's|YOUR_DOCKERHUB_USERNAME/todo-app:latest|${DOCKER_IMAGE}:${DOCKER_TAG}|g' k8s/deployment.yaml
                    """
                    sh 'kubectl apply -f k8s/deployment.yaml'
                    sh 'kubectl apply -f k8s/service.yaml'
                    sh 'kubectl rollout status deployment/todo-app-deployment --timeout=120s'
                    sh 'kubectl get pods'
                    sh 'kubectl get services'
                    echo 'Application deployed to Kubernetes successfully.'
                }
            }
        }

        // ── STAGE 4: Prometheus / Grafana Health Check ───────────
        stage('Prometheus/Grafana Health Check') {
            steps {
                script {
                    sh '''
                        echo "Checking Prometheus..."
                        curl -sf http://localhost:9090/-/healthy && echo "Prometheus: OK" || echo "Prometheus: Not reachable (may not be started yet)"

                        echo "Checking Grafana..."
                        curl -sf http://localhost:3000/api/health && echo "Grafana: OK" || echo "Grafana: Not reachable (may not be started yet)"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully! Application is live.'
        }
        failure {
            echo '❌ Pipeline failed. Check console output above for errors.'
        }
    }
}
