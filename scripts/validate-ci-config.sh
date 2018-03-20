#!/usr/bin/env bash

# The following line is needed by the CircleCI Local Build Tool (due to Docker interactivity)
exec < /dev/tty

if hash circleci 2>/dev/null; then
  # If validation fails, tell Git to stop and provide error message. Otherwise, continue.
  if ! eMSG=$(circleci config validate -c .circleci/config.yml); then
    echo "CircleCI Configuration Failed Validation."
    echo $eMSG
    exit 1
  else
    echo "CircleCI Configuration Validated."
    exit 0
  fi
fi

exit 0
