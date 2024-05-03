#!/bin/sh

# Script for live reload.
# It gets the IP from the machine and updates the json file
#
# author: Starley Cazorla
# version: 2.0
# date: 19/12/2023
#

clear
printf "\033[1;34m" # Blue
printf "\n"
printf "========================================================================\n"
printf "                UPDATING CAPACITOR CONFIG JSON                    \n"
printf "========================================================================\n"
printf "\033[0m" # Reset to default
printf "\n"

printf "\033[1;31mOnly works using the local IP!\n\033[0m"
printf "\n"

printf "This feature is used to visualize changes in the app\n"
printf "in real time on a physical device without having to go through the\n"
printf "build process or page reload every time you make a\n"
printf "change in the code.\n"
printf "\n"

# Get the local IP address.
localIp=$(hostname -I | awk '{print $1}')

printf "\033[0;32mAfter changing, build and install on the device.\n\033[0m" # Green
printf "\n"
# Get the appId and transform it to create the hostname
appId=$(jq -r .appId capacitor.config.json)
hostname=$(echo $appId | awk -F. '{for(i=NF; i>1; i--) printf $i "."; print $1}')
hostname="${hostname}"

printf "Choose the desired option:\n"
printf "  [1] Use local IP: \033[1;33m$localIp\033[0m\n"
printf "  [2] Return to default configuration: \033[1;33m$hostname\033[0m\n"
printf "  [3] Cancel changes\n"
read answer

if [ "$answer" = "3" ]; then
  printf "\033[0;32mChanges canceled by user.\n\033[0m" # Green
  exit 0
fi

if [ "$answer" = "1" ]; then
  # Ask the user for the desired port
  printf "\n"
  printf "Please enter the port you want to use \033[1;33m(default 8100):\033[0m\n "
  read portInput
  port=${portInput:-8100} # Use the entered value or 8100 as default

  jq --arg localIp "$localIp" --argjson port "$port" '.server.url="http://\($localIp):\($port)" | del(.server.hostname)' capacitor.config.json >tmp.$$.json && mv tmp.$$.json capacitor.config.json
  printf "\033[0;32m\nChanged to use local IP \n\033[0m" # Green
  printf "Now you can use your machine as a server!\n"
  printf "Remember to run the \033[1;33mLOCAL_SERVER\033[0m\n"
fi
if [ "$answer" = "2" ]; then
  jq --arg hostname "$hostname" '.server.hostname=$hostname | del(.server.url)' capacitor.config.json >tmp.$$.json && mv tmp.$$.json capacitor.config.json
  printf "\033[0;32m\nChanged to use the hostname \n\033[0m" # Green
  printf "Returning to the standard config for production.\n"
fi

printf "\033[1;34m" # Blue
printf "\n"
printf "====================================================================\n"
printf "                UPDATES COMPLETED SUCCESSFULLY                  \n"
printf "====================================================================\n"
printf "\033[0m" # Reset to default
printf "\n"
