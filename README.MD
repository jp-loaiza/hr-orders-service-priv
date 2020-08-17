# Initial/Local Deployment Guide
Since our kubernetes deployment is based off our docker image, we need to fist build the docker image and the push it to IBM Cloud registry.

1. Setup the environment
```
ENVIRONMENT=development && BUILD_NUMBER=1
```
```
source .env && source environment.sh
```

- Note: Refer to .env-template for all the required environmental variables

2. Build and push the docker image to IBM Cloud repository
```
source build.sh
```

- Note: reference https://docs.docker.com/get-started/part2/#build-the-app
- Note: IBM Cloud registry is accessible at https://cloud.ibm.com/kubernetes/registry/main/start


3. Set the cluster by replacing clusterId from access tab of the cluster on IBM Cloud and deploy
```
ibmcloud ks cluster config --cluster {clusterId}
```
```
source deploy.sh
```

4. Expose the deployment as a service to accept requests for sending notifications
```
kubectl expose deployment hr-orders-service --type=LoadBalancer --name=hr-orders-service
```
- Note: you can check health by using EXTERNAL-IP from `kubectl get services` and then pinging `EXTERNAL-IP:8080/health` from your local machine or sending requests to `EXTERNAL-IP:8080/list` and `EXTERNAL-IP:8080/put` with proper credentials
- Note: since load balancers are not free ($0.02 per hour as of May 2020), delete if deployed but not needed with `kubectl delete service hr-orders-service`

# Delivery Pipeline
- Build script:
```
source environment.sh
source build.sh
```
- Deploy script:
```
source environment.sh
source deploy.sh
```
- These environmental variables should be set for the toolchain pipeline:
  - ENVIRONMENT
  - SFTP_HOST_KUBERNETES
  - SFTP_PORT
  - SFTP_USERNAME
  - SFTP_PRIVATE_KEY
  - SFTP_INCOMING_ORDERS_PATH
  - INCOMING_ORDER_FIELDS
  - REGISTRY_URL
  - REGISTRY_NAMESPACE
  - IMAGE_NAME
  - EMAIL_API_USERNAME
  - EMAIL_API_PASSWORD
  - EMAIL_API_URL
  - EMAIL_API_URL_KUBERNETES
  - NOTIFICATIONS_BEARER_TOKEN
  - HEALTHZ_AUTHORIZATION
  - SEND_NOTIFICATIONS_INTERVAL
  - SHOULD_RUN_JOBS
  - NEWRELIC_APP_NAME
  - NEWRELIC_LICENSE_KEY

- Note: Each added environmntal variable should be set in '.env-template', 'deployment.yaml' and 'deploy.sh' and toolchain pipeline.

- Note: In kubernetes deployment, values of confidential info should be read from secretKeyRef and value of configurations should be read from configMapKeyRef.

- Note: These environmental variables are automatically set by the build stage if you configure it properly:
  - BUILD_NUMBER

- NOTE: For the build stage, select "Builder type" as the build type; however, note that we override all the actual relevant parameters by setting them as environmental parameters i.e. REGISTRY_URL, REGISTRY_NAMESPACE and IMAGE_NAME

- Note: This environmental variables is created during build/deployment:
  - IMAGE

- Note: SFTP and Email API hosts for kubernetes and local environments are different. Refer to 'deploy.sh' for details of how it's set on kubernetes.

- Note: If there are characters in the value of the environmental variables which need to be escaped e.g. `$service` you need to escape them once if deploying locally to kubernetes i.e. use `\$services` in '.env' and escape them twice if setting the variable in the toolchain i.e. use `\\\$services`

TODO: Currently all the traffic on Kubernetes is being routed via the Internet, instead of through the Vyatta and so HarryRosen has to manually add the IP address of each of our clusters to their white list so we can connect to their service via their public IP addresses. However, we already have a VPN setup that obviates the need for whitelisting, which is what we are using locally and so the reason behind having different IP addresses. We need to add a route that says all 10.210.x.x traffic routes through the eth0 or eth1 nic.

# CICD (IBM Cloud Toolchain)
- If you have modified/added any environmental variables, the changes should be reflected in the toolchain configuration.

# Logs
## Guide for adding tags to logDNA logs
Official guide can be found here:
https://cloud.ibm.com/docs/Log-Analysis-with-LogDNA?topic=Log-Analysis-with-LogDNA-adding_tags#adding_tags_kube

Alternatively, for a one time setup, you can update the configuration of logDNA daemon-sets by going through IBM Cloud cluster’s UI Workloads >  Daemon Sets > logdna-agent and then updating the env field of the manifest. It will look like this e.g.
```javascript
"env": [{
    "name": "LOGDNA_AGENT_KEY",
    "valueFrom": {
      "secretKeyRef": {
        "name": "logdna-agent-key",
        "key": "logdna-agent-key"
      }
    }
  },
  {
    "name": "LDAPIHOST",
    "value": "api.us-south.logging.cloud.ibm.com"
  },
  {
    "name": "LDLOGHOST",
    "value": "logs.us-south.logging.cloud.ibm.com"
  },
  {
    "name": "LOGDNA_PLATFORM",
    "value": "k8s"
  },
  {
    "name": "LOGDNA_TAGS",
    "value": "development,myplanet-cluster-development"
  }
]
```

# Troubleshooting
## To redeploying using the same image
- First delete the current deployment with `kubectl delete deployment hr-orders-service`

## Code run doesn't match the code commited
- Make sure your docker image is not stale

## Environmental variables are missing their values
- Make sure environmental variables for the toolchain are up to date

## Couldn't find key ... in ConfigMap default/hr-orders-service
- Possibly a mismatch between enviroment variables set in `deploy.sh` and those defined in `deployment.yaml`. Make sure that, for each enviroment variable defined in `deployment.yaml`, there is a corresponding enviroment variable set in `deploy.sh`
