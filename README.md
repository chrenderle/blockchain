# Blockchain Projekt
## Dokumentation
[hier](documentation/Dokumentation.pdf)
## Präsentation
[her](documentation/Präsentation.pdf)
## Requirements
- [Docker](https://www.docker.com/products/docker-desktop) (not Docker-Toolbox)
- [Visual Studio Code](https://code.visualstudio.com/)
  - Extension: [Remote Development](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)
## Installation
1. Clone this repository
2. Open directory in VS Code
3. Open commands (CTRL + SHIFT + P)
4. Select: Remote-Containers: Reopen in Container
5. Wait until the build is finished
6. Open a new terminal
7. Run "yarn start"
8. Open a new terminal
9. Run "truffle migrate && cd app && yarn dev --host 0.0.0.0"

You can now access the website at [http://localhost:8080](http://localhost:8080) or if the terminal says another port, this port.