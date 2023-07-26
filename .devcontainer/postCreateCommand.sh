#!/bin/bash

# Update apt
sudo apt-get update

# Install and setup utilities
sudo apt-get install -y git-flow bash-completion
echo ". /usr/share/bash-completion/bash_completion" >> ~/.bashrc

# Install VNC tools
sudo apt-get install -y xvfb \
    x11vnc \
    novnc \
    websockify

# Install Chromium + Fonts
sudo apt-get install -y --no-install-recommends chromium \
    fonts-ipafont \
    fonts-ipaexfont

# Set environmental variables
echo "export DISPLAY=:0" >> ~/.bashrc
