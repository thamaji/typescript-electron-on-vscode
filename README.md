Electron TypeScript React on VS Code
====

## Requirement

- [Visual Studio Code](https://code.visualstudio.com/download)
- [Docker](https://docs.docker.com/get-docker/)
- [VS Code Remote container](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

## Getting Started

### Open this project in VSCode.

```
$ code .
```

### Reopen project with Remote-Containers.

Open command palet `Ctrl + Shift + P` and execute `Remote-Containers: Reopen in Container`.

### Rename project-name in `package.json`.

```
{
  "name": "my-project", // change it!
  "version": "1.0.0",
  :
  :
}
```

### Start your project with development mode.

```
$ yarn start
```

you can see linux desktop in http://localhost:8080.

### Package your project for some platforms.

```
$ yarn package
```

results are in `./build` directory.
