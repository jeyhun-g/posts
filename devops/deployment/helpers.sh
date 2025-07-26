ECHO_RED='\033[0;31m'
ECHO_NC='\033[0m' # no color

print_error(){
  echo "${ECHO_RED}$1${ECHO_NC}"
}