#!/bin/bash

# Script for update version build.
# It gets the app version android and ios and updates the build number and version number
#
# author: Starley Cazorla
# version: 2.0
# date: 17/11/2023
#

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Sem cor

# Function to display a decorative line
show_line() {
  printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
}

# Function to display the header
show_header() {
  clear
  echo -e "${BLUE}============================================================================="
  echo "                     UPDATE VERSION CODE ANDROID AND IOS                    "
  echo -e "=============================================================================${NC}"
  echo
}

# Function to display application options
show_options() {
  echo -e "${YELLOW}Choose one:${NC}"
  for i in "${!app_names[@]}"; do
    echo "$(($i + 1)). ${app_names[$i]}"
  done
  echo
  echo -e "${RED}0. Exit${NC}"
  echo
  echo -n "Option: "
}

# Function to get the highest Android version code and name
get_version_build_number_android() {
  highest_versioncode_android=0
  highest_versionname_android=0

  for arquivo in $gradle_files; do
    versioncode_atual=$(grep -Po '(?<=versionCode\s)\d+' "$arquivo")
    # Remove os pontos e converte para inteiro
    versionname_atual=$(grep -Po '(?<=versionName\s")[^"]+' "$arquivo" | tr -d '.')

    if ((versioncode_atual > highest_versioncode_android)); then
      highest_versioncode_android=$versioncode_atual
    fi

    # A comparação só será feita se versionname_atual for um número
    if [[ $versionname_atual =~ ^[0-9]+$ ]] && ((versionname_atual > highest_versionname_android)); then
      highest_versionname_android=$versionname_atual
    fi
  done

  # Converte highest_versionname_android de volta para o formato original (ex: 100 -> 1.0.0)
  highest_versionname_android=${highest_versionname_android:0:1}.${highest_versionname_android:1:1}.${highest_versionname_android:2}
}

# Function to get the highest iOS version
get_version_build_number_ios() {
  highest_versioncode_ios=0
  highest_version_number_ios=0

  for arquivo in $pbxproj_files; do
    build_number_atual=$(grep -Eo 'CURRENT_PROJECT_VERSION = [0-9]+;' "$arquivo" | grep -Eo '[0-9]+' | head -n 1)
    version_number_atual=$(grep -Eo 'MARKETING_VERSION = [0-9]+(\.[0-9]+)*;' "$arquivo" | grep -Eo '[0-9]+(\.[0-9]+)*' | head -n 1)

    if [[ "$build_number_atual" -gt "$highest_versioncode_ios" ]]; then
      highest_versioncode_ios=$build_number_atual
    fi

    # Compare versões como strings para garantir que a versão '10.0' seja maior que '2.0'
    if [[ "$version_number_atual" > "$highest_version_number_ios" ]]; then
      highest_version_number_ios=$version_number_atual
    fi
  done
}

# Function to display a success message
exibir_formulario_alteracao() {
  show_line
  echo -e "${YELLOW}SELECTED PROJECT ---> $app_name${NC}"
  echo
  echo -e "Enter the new value (leave blank to keep the current value):"
}

# Função para exibir mensagem de sucesso
show_success_message() {
  show_line
  echo -e "${GREEN}The versionCode and versionName values have been successfully updated!${NC}"
}

# Function to display an exit message
show_exit_message() {
  show_line
  echo -e "${RED}Exiting...${NC}"
  exit 0
}

# Function to display confirmation message
show_confirmation_message() {
  echo
  echo -e "Confirm the change of values?"
  echo -e "1. ${GREEN}Yes${NC}"
  echo -e "2. No"
  echo -e "${RED}0. Exit${NC}"
  echo
  echo -n "Option: "
}

# Search for build.gradle files within directories containing the path "/android/app/"
gradle_files=$(find -path "*/android/app/build.gradle" -type f)
# Search for pbxproj files within directories containing the path "/ios/"
pbxproj_files=$(find -path "*/ios/App/*.xcodeproj/project.pbxproj" -type f)

# Check if build.gradle files were found
if [ -z "$gradle_files" ]; then
  echo -e "${RED}No build.gradle files found in directories with the path '/android/app/'.${NC}"
  exit 1
fi

# Array to store the names of the found applications
app_names=()

# Iterate over the found build.gradle files
for arquivo in $gradle_files; do
  # Extract the project name
  nome_projeto=$(grep 'applicationId' "$arquivo" | awk '{print $2}' | tr -d '"')
  app_names+=("$nome_projeto")
done

# Main script loop
while true; do
  show_header
  show_options

  # Read the chosen option
  read opcao
  if [ "$opcao" -eq $((${#app_names[@]} + 1)) ]; then
    get_version_build_number_android
    get_version_build_number_ios
    show_header
    echo -e "${YELLOW}ATTENTION --- ${RED}YOU ARE CHANGING ALL PROJECTS${NC} ${YELLOW} --- ATTENTION ${NC}"
    echo ""
    echo "Highest Android versionCode found: $highest_versioncode_android"
    echo "Highest Android versionName found: $highest_versionname_android"
    echo ""
    echo "Highest IOS CURRENT_PROJECT_VERSION found: $highest_versioncode_ios"
    echo "Highest IOS MARKETING_VERSION found: $highest_version_number_ios"
    echo ""
    echo -e "${GREEN}New Android versionCode${NC} (leave blank to not change): "
    read new_version_code
    echo -e "${GREEN}New Android versionName${NC} (leave blank to not change): "
    read new_version_name
    echo ""
    echo -e "${GREEN}New IOS CURRENT_PROJECT_VERSION${NC} (leave blank to not change): "
    read new_ios_build_number
    echo -e "${GREEN}New IOS MARKETING_VERSION${NC} (leave blank to not change): "
    read new_ios_version_number

    show_confirmation_message
    read confirmation

    if [ "$confirmation" -eq 1 ]; then
      for app_name in "${app_names[@]}"; do
        gradle_file_path=$(find android/app -maxdepth 1 -type f -name "build.gradle")
        pbxproj_file_path=$(find ios/App/App.xcodeproj -maxdepth 1 -type f -name "project.pbxproj")

        if [ -n "$new_version_code" ]; then
          sed -i "s/\(versionCode\s\+\)\([0-9]\+\)/\1$new_version_code/g" "$gradle_file_path"
        fi

        if [ -n "$new_version_name" ]; then
          sed -i "s/\(versionName\s\"\)\([^\"]\+\)/\1$new_version_name/g" "$gradle_file_path"
        fi

        # Atualizar iOS Build Number
        if [ -n "$new_ios_build_number" ]; then
          echo "Updating $arquivo with new build number: $new_ios_build_number"
          if ! sed -i "s/CURRENT_PROJECT_VERSION = [0-9]*;/CURRENT_PROJECT_VERSION = $new_ios_build_number;/" "$pbxproj_file_path"; then
            echo "Failed to update $pbxproj_file_path"
          fi
        fi

        # Atualizar iOS Version Number
        if [ -n "$new_ios_version_number" ]; then
          echo "Updating $arquivo with new version number: $new_ios_version_number"
          if ! sed -i "s/MARKETING_VERSION = [0-9\.]*;/MARKETING_VERSION = $new_ios_version_number;/" "$pbxproj_file_path"; then
            echo "Failed to update $pbxproj_file_path"
          fi
        fi
      done
      show_header
      show_success_message
      sleep 2
    fi

  elif [ "$opcao" -ge 1 ] && [ "$opcao" -le ${#app_names[@]} ]; then
    app_name="${app_names[$(($opcao - 1))]}"
    gradle_file_path=$(find android/app -maxdepth 1 -type f -name "build.gradle")
    current_version_code=$(grep -Po '(?<=versionCode\s)\d+' "$gradle_file_path")
    current_version_name=$(grep -Po '(?<=versionName\s")[^"]+' "$gradle_file_path")

    # IOS VERSION
    pbxproj_file_path=$(find ios/App/App.xcodeproj -maxdepth 1 -type f -name "project.pbxproj")

    # pbxproj_file_path=$(find . -name 'project.pbxproj' -print 2>/dev/null | grep "/$app_name/")
    current_ios_build_number=$(grep -Eo 'CURRENT_PROJECT_VERSION = [0-9]+;' "$pbxproj_file_path" | grep -Eo '[0-9]+' | head -n 1)
    current_ios_version_number=$(grep -Eo 'MARKETING_VERSION = [0-9]+(\.[0-9]+)*;' "$pbxproj_file_path" | grep -Eo '[0-9]+(\.[0-9]+)*' | head -n 1)

    show_header
    exibir_formulario_alteracao
    echo "Current Android versionCode: $current_version_code"
    echo "Current Android versionName: $current_version_name"
    echo
    echo "Current IOS CURRENT_PROJECT_VERSION Number: $current_ios_build_number"
    echo "Current IOS MARKETING_VERSION Number: $current_ios_version_number"
    echo
    echo -e "${GREEN}New Android versionCode${NC} (leave blank to keep the current value): "
    read new_version_code
    echo
    echo -e "${GREEN}New Android versionName${NC} (leave blank to keep the current value): "
    read new_version_name
    # IOS VERSION
    echo -e "${GREEN}New iOS CURRENT_PROJECT_VERSION Number${NC} (leave blank to not change): "
    read new_ios_build_number
    echo -e "${GREEN}New iOS MARKETING_VERSION Number${NC} (leave blank to not change): "
    read new_ios_version_number

    if [ "$new_version_name" = "0" ]; then
      show_exit_message
    fi

    show_header
    echo -e "${YELLOW}SELECTED PROJECT ---> $app_name${NC}"
    echo
    echo "Confirm the new values:"
    echo -e "New Android versionCode: ${RED} ${current_version_code}${NC} --> ${GREEN} $new_version_code ${NC}"
    echo -e "New Android versionName: ${RED} ${current_version_name}${NC} --> ${GREEN} $new_version_name ${NC}"
    echo ''
    echo -e "New iOS Build Number: ${RED} ${current_ios_build_number}${NC} --> ${GREEN} $new_ios_build_number ${NC}"
    echo -e "New iOS Version Number: ${RED} ${current_ios_version_number}${NC} --> ${GREEN} $new_ios_version_number ${NC}"
    show_confirmation_message
    read confirmation

    if [ "$confirmation" -eq 1 ]; then
      if [ -n "$new_version_code" ]; then
        sed -i "s/\(versionCode\s\+\)\([0-9]\+\)/\1$new_version_code/g" "$gradle_file_path"
      fi

      if [ -n "$new_version_name" ]; then
        sed -i "s/\(versionName\s\"\)\([^\"]\+\)/\1$new_version_name/g" "$gradle_file_path"
      fi

      # Atualizar iOS Build Number
      if [ -n "$new_ios_build_number" ]; then
        echo "Updating $arquivo with new build number: $new_ios_build_number"
        if ! sed -i "s/CURRENT_PROJECT_VERSION = [0-9]*;/CURRENT_PROJECT_VERSION = $new_ios_build_number;/" "$pbxproj_file_path"; then
          echo "Failed to update $pbxproj_file_path"
        fi
      fi

      # Atualizar iOS Version Number
      if [ -n "$new_ios_version_number" ]; then
        echo "Updating $arquivo with new version number: $new_ios_version_number"
        if ! sed -i "s/MARKETING_VERSION = [0-9\.]*;/MARKETING_VERSION = $new_ios_version_number;/" "$pbxproj_file_path"; then
          echo "Failed to update $pbxproj_file_path"
        fi
      fi

      show_header
      show_success_message
      sleep 2
    fi
  elif [ "$opcao" -eq 0 ]; then
    show_exit_message
  else
    echo -e "${RED}Invalid option! Press Enter to continue.${NC}"
    read
  fi
done
