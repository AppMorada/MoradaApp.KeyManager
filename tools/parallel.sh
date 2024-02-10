#!/bin/sh

CYAN='\033[0;36m'
GREEN='\033[0;32m'
ORANGE='\033[0;33m'
RESET_COLOR='\033[0m'

INFO_FLAG="[${CYAN}INFO${RESET_COLOR}]"
BULLET_PT="${CYAN}${RESET_COLOR}"
WARN_FLAG="[${ORANGE}WARN${RESET_COLOR}]"

/usr/bin/clear

SHA256=$(find functions -not -wholename *.spec.ts -type f -exec sha256sum {} \; | sha256sum | sed 's/...$//')
TIME=$(( $(date +%s%N)/1000000 ))

if ! test -f ./project-metadata.dev.json || ! test -d ./dist; then
    /bin/echo -e "${WARN_FLAG} Impossible to find any trustable dist source. Building the project..."
    pnpm nest build

    METADATA_FILE="{\n\t\"sha256Token\": \"${SHA256}\",\n\t\"iat\": ${TIME}\n}"
    printf "%b\t" $METADATA_FILE | tee "./project-metadata.dev.json" > /dev/null
fi

/bin/echo -e "${INFO_FLAG} Executing the following commands in parallel:"
/bin/echo -e "  ${BULLET_PT}  ${ORANGE}firestore.sh${RESET_COLOR}"
/bin/echo -e "  ${BULLET_PT}  ${ORANGE}build_watch.sh${RESET_COLOR}"
/bin/echo -e "  ${BULLET_PT}  ${ORANGE}functions.sh${RESET_COLOR}"

BUILD_CMD="sh -c ./tools/build_watch.sh"
FIRESTORE_CMD="sh -c ./tools/firestore.sh"

CREATE_KEY_FN_CMD="npm-watch functions:createkeyfunc"
UPDATE_KEY_FN_CMD="npm-watch functions:updatekeytriggerfunc"
DELETE_KEY_FN_CMD="npm-watch functions:deletekeyfunc"

pnpm dotenv -e .env -- \
    concurrently \
    --kill-signal \
    --kill-others \
    -n firestore,build,fn:createkey,fn:updatekey,fn:deletekey --timings -c "yellow.bold,green.bold,green.bold,green.bold" \
    "${FIRESTORE_CMD}" \
    "${BUILD_CMD}" \
    "${CREATE_KEY_FN_CMD}" \
    "${UPDATE_KEY_FN_CMD}" \
    "${DELETE_KEY_FN_CMD}"
