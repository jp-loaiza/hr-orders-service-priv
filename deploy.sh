# update existing configmap
kubectl create configmap hr-orders-service \
  --from-literal=SFTP_HOST=$SFTP_HOST_KUBERNETES \
  --from-literal=SFTP_PORT=$SFTP_PORT \
  --from-literal=SFTP_INCOMING_ORDERS_PATH=$SFTP_INCOMING_ORDERS_PATH --from-literal=INCOMING_ORDER_FIELDS=$INCOMING_ORDER_FIELDS \
  -o yaml --dry-run | kubectl apply -f -

# update existing secret
kubectl create secret generic hr-orders-service \
  --from-literal=SFTP_USERNAME=$SFTP_USERNAME \
  --from-literal=SFTP_PRIVATE_KEY=$SFTP_PRIVATE_KEY \
  -o yaml --dry-run | kubectl apply -f -

sed "s~{IMAGE}~$IMAGE~g" ./deployment.yaml > ./deployment-populated.yaml
kubectl apply -f ./deployment-populated.yaml

# cleanup temporary files
rm ./deployment-populated.yaml
