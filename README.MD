# Guides
## To build
Since our kubernetes deployment is based off our docker image, we need to fist build the docker image and the push it to IBM Cloud registry.

0. Setup the environment
```
ibmcloud cr login
```

1. Build docker image with proper version e.g. 0.0.1 as the tag
```
export VERSION={version}
```
```
docker build --tag=hr-orders-service:$VERSION .
```

2. Tag the image on the repository
```
docker tag hr-orders-service:$VERSION us.icr.io/hrretailplatform/hr-orders-service:$VERSION
```

3. Push the image to the repository
```
docker push us.icr.io/hrretailplatform/hr-orders-service:$VERSION
```

- Note: reference https://docs.docker.com/get-started/part2/#build-the-app
- Note: IBM Cloud registry is accessible at https://cloud.ibm.com/kubernetes/registry/main/start

## To deploy
0. Set up the environment
```
ibmcloud ks cluster config --cluster {clusterId}
```
```
source .env
```
- Note: Refer to .env-template for all the required environmental variables

1. Setup secrets and configurations on the cluster
```
kubectl create configmap hr-orders-service \
  --from-literal=SFTP_HOST=$SFTP_HOST_KUBERNETES \
  --from-literal=SFTP_PORT=$SFTP_PORT \
  --from-literal=SFTP_INCOMING_ORDERS_PATH=$SFTP_INCOMING_ORDERS_PATH --from-literal=INCOMING_ORDER_FIELDS=$INCOMING_ORDER_FIELDS
```
```
kubectl create secret generic hr-orders-service \
  --from-literal=SFTP_USERNAME=$SFTP_USERNAME \
  --from-literal=SFTP_PRIVATE_KEY=$SFTP_PRIVATE_KEY
```

2. Deploy the service
Update image version of the container in 'deployment.yaml' and then apply the deployment file:
```
sed "s/{version}/$VERSION/" ./deployment.yaml > ./deployment-versioned.yaml && kubectl apply -f ./deployment-versioned.yaml && rm ./deployment-versioned.yaml
```

3. (optional) Expose the deployment as a service for debugging
```
kubectl expose deployment hr-orders-service --type=LoadBalancer --name=hr-orders-service
```
- Note: you can check health by using EXTERNAL-IP from `kubectl get services` and then pinging `EXTERNAL-IP:8080/health` from your local machine
- Note: since load balancers are not free ($0.02 per hour as of May 2020), delete if deployed but not needed with `kubectl delete service hr-orders-service `