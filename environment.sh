#!/bin/bash
echo -e "Environment variables:"
echo "ENVIRONMENT=${ENVIRONMENT}"
echo "REGISTRY_URL=${REGISTRY_URL}"
echo "REGISTRY_NAMESPACE=${REGISTRY_NAMESPACE}"
echo "IMAGE_NAME=${IMAGE_NAME}"
echo "BUILD_NUMBER=${BUILD_NUMBER}"
# e.g. us.icr.io/hrretailplatform/hr-orders-service:version
IMAGE=$REGISTRY_URL/$REGISTRY_NAMESPACE/$IMAGE_NAME:$ENVIRONMENT-$BUILD_NUMBER
echo "IMAGE=${IMAGE}"

# Learn more about the available environment variables at:
# https://cloud.ibm.com/docs/services/ContinuousDelivery?topic=ContinuousDelivery-deliverypipeline_environment#deliverypipeline_environment
