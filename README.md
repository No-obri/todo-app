# Todo App – CSC418 DevOps Lab Project

**Student:** Fiza Maheen  
**Roll No:** SP23-BCT-016  
**Course:** CSC418 – DevOps for Cloud Computing

## Setup Instructions

### Before pushing, replace these placeholders in the files:
- `YOUR_DOCKERHUB_USERNAME` → your actual DockerHub username (in `Jenkinsfile` and `k8s/deployment.yaml`)
- `YOUR_GITHUB_USERNAME` → your actual GitHub username (in `Jenkinsfile`)

## Project Structure
```
todo-app/
├── app.js              # Node.js Express application
├── package.json        # Dependencies
├── Dockerfile          # Docker image definition
├── Jenkinsfile         # CI/CD pipeline script
├── .gitignore
└── k8s/
    ├── deployment.yaml # Kubernetes Deployment (app + mongo)
    └── service.yaml    # Kubernetes Services (NodePort + ClusterIP)
```

## Pipeline Stages
1. **Code Fetch** – Pulls code from this GitHub repo
2. **Docker Image Creation** – Builds Docker image
3. **Push to DockerHub** – Pushes image to DockerHub registry
4. **Kubernetes Deployment** – Deploys to Minikube cluster
5. **Prometheus/Grafana Health Check** – Verifies monitoring is running
