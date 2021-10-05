echo -e "DEPRECATED - please use build_image_buildkit.sh"
exit 0
echo -e "Building container image"
set -x
ibmcloud cr build -t $IMAGE .
set +x
