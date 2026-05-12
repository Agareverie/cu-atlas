# CU Atlas

(Insert rook mascot photo here)

Ever wonder where that building you have to go for your General Education course is? Well, this is the app for you!

## Group Members

1. Yanathep Prasitsomsakul 6738067321
2. Syeda Azmathunnisa Raza 6738060921

## Technology Stack

The application has a TypeScript frontend with `Expo` along with a Python Backend using `Flask` and `MongoDB`.

- **Node.js** v22.22.2 (LTS)
- **Expo** SDK 54
- **Python** 3.13.13
- **Flask** 3.1.3
- (MongoDB integration not added yet)
- (Docker not added yet)

### Scope

The current scope of the application is a mobile application that can run on Android devices.

### Dependencies

- A version manager for **Node.js** (Tested on `fnm`)
- A version manager for **Python** (Tested on `pyenv`)
- Visual Studio Code (Recommended)
- Android Studio IDE (For Android SDK)
- A mobile phone set in Android Studio's device manager (Tested on Pixel 8)

### Setting up (MacOS)

Install `fnm` and `pyenv` using `brew`.

```bash
brew install fnm pyenv
```

`pyenv` also requires a few build dependencies, also installable from `brew`.

```bash
brew install openssl readline sqlite3 xz tcl-tk@8 libb2 zstd zlib pkgconfig
```

Ensure you have these lines of code in your `~/.zshrc`.

```bash
# fnm (node.js)
eval "$(fnm env --use-on-cd --version-file-strategy=recursive --shell zsh)"

# pyenv (python)
export PYENV_ROOT="$HOME/.pyenv"
[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init - zsh)"

# Android/Android Studio
export ANDROID_HOME=$HOME/Library/Android/sdk
export ANDROID_SDK_ROOT=$ANDROID_HOME
export PATH=$ANDROID_HOME/platform-tools:$PATH
export PATH=$ANDROID_HOME/emulator:$PATH
```

Then restart the terminal.

```bash
source .zshrc
```

## Installation

### Cloning

First go to a directory where you want the project to be in, then `git clone` the repository.

```bash
git clone https://github.com/Agareverie/cu-atlas.git
```

Open the `cu-atlas` folder in Visual Studio Code, then install the recommended extensions from `extensions.json`.

### Installing Language Versions

After cloning, use `fnm` and `pyenv` respectively to install the correct Node.js and Python versions for the project.

```bash
# fnm
fnm install
fnm use

# pyenv
pyenv install 3.13.13
pyenv local 3.13.13
```

After installing their respective versions, check if those versions are the ones being used.

```bash
node --version  # Should show v22.22.2
python --version  # Should show 3.13.13 (NOTE: pyenv uses python for everything, not python3)
```

If not, try restarting the shell and trying again.

### Installing Dependencies

Install the dependencies necessary with `npm`. This should install the dependencies for the repository and also everything in the expo app.

```bash
npm install
```

Then, go to the api app directory.

```bash
cd apps/api
```

Create a virtual environment with python, and then install the dependencies as stated in requirements.txt. A cross-platform setup script will be created later to simplify this.

```bash
python -m venv .venv
source .venv/bin/activate  # MacOS/Linux
# or .venv\Scripts\activate  # Windows

pip install -r requirements.txt  # Includes flask, flask-cors, etc.
```

Then, for VS code users, select the Python Interpreter (CTRL/CMD+SHIFT+P then `Python: Select Interpreter`) and choose "Use Python from `python.defaultInterpreterPath` setting" to make the language server lint properly.

To open and start the application, use `npm run start` on each of the workspaces.

```bash
npm run start --workspace=apps/mobile  # Opens only mobile app
npm run start --workspace=apps/api  # Opens only API
```

A script has been added into the root's `package.json` allowing one to run both instances at the same time.

```bash
npm run start  # Opens both at the same time (Recommended)
```

Once the mobile app is open, the Expo CLI will pop up showing the controls. Press `a` to open the android emulator. iOS is not tested. The API can also be accessed by going to `http://127.0.0.1:3000`. Press CTRL+C to close both processes.
