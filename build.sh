echo -e "Building container image"
set -x
ibmcloud cr region-set us-south
ibmcloud cr build --accept-deprecation -t $IMAGE .
set +x
