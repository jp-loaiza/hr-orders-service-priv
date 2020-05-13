# update existing configmap
kubectl create configmap hr-orders-service \
  --from-literal=SFTP_HOST=$SFTP_HOST_KUBERNETES \
  --from-literal=SFTP_PORT=$SFTP_PORT \
  --from-literal=SFTP_INCOMING_ORDERS_PATH=$SFTP_INCOMING_ORDERS_PATH --from-literal=INCOMING_ORDER_FIELDS=$INCOMING_ORDER_FIELDS \
  --from-literal=CT_PROJECT_KEY=$CT_PROJECT_KEY \
  --from-literal=CT_OAUTH_HOST=$CT_OAUTH_HOST \
  --from-literal=CT_HOST=$CT_HOST \
  -o yaml --dry-run | kubectl apply -f -

# update existing secret
kubectl create secret generic hr-orders-service \
  --from-literal=SFTP_USERNAME=$SFTP_USERNAME \
  --from-literal=SFTP_PRIVATE_KEY=$SFTP_PRIVATE_KEY \
  --from-literal=CT_CLIENT_ID=$CT_CLIENT_ID \
  --from-literal=CT_CLIENT_SECRET=$CT_CLIENT_SECRET \
  -o yaml --dry-run | kubectl apply -f -

sed "s~{IMAGE}~$IMAGE~g" ./deployment.yaml > ./deployment-populated.yaml
kubectl apply -f ./deployment-populated.yaml

# cleanup temporary files
rm ./deployment-populated.yaml
