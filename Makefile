VNC_DISPLAY = ":0"
VNC_SCREEN_RESOLUTION = "1024x768x24"
VNC_PORT_RFB = 5900
VNC_PORT_WEB = 6080

.SILENT:
.PHONY: display-server
## Launch display server
display-server:
	Xvfb ${VNC_DISPLAY} -screen 0 ${VNC_SCREEN_RESOLUTION}

.SILENT:
.PHONY: vnc
## Launch VNC server
vnc:
	x11vnc -display ${VNC_DISPLAY} -rfbport ${VNC_PORT_RFB} -forever

.SILENT:
.PHONY: novnc
## Launch VNC client
novnc:
	websockify --web=/usr/share/novnc/ ${VNC_PORT_WEB} localhost:${VNC_PORT_RFB}

.DEFAULT_GOAL := help
.SILENT:
.PHONY: help
help:
	@echo "$$(tput setaf 2)Available rules:$$(tput sgr0)";sed -ne"/^## /{h;s/.*//;:d" -e"H;n;s/^## /---/;td" -e"s/:.*//;G;s/\\n## /===/;s/\\n//g;p;}" ${MAKEFILE_LIST}|awk -F === -v n=$$(tput cols) -v i=4 -v a="$$(tput setaf 6)" -v z="$$(tput sgr0)" '{printf"- %s%s%s\n",a,$$1,z;m=split($$2,w,"---");l=n-i;for(j=1;j<=m;j++){l-=length(w[j])+1;if(l<= 0){l=n-i-length(w[j])-1;}printf"%*s%s\n",-i," ",w[j];}}'
