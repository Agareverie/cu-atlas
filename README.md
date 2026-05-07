# CU Atlas

(Insert rook mascot photo here)

**Group Members**:

1. Yanathep Prasitsomsakul
2. Syeda Raza

## Development

### Dependencies

- Node.js 25.8.0
- NPM 11.11.0
- Python 3.14.2
- Visual Studio Code (Recommended)

P.S Might revert to an older version depending on how Python and Node are installed. (Since I'm using the homebrew versions right now which auto-updates to the latest, and not a proper version manager)

#### Android Dependencies

- Android Studio application
- A mobile phone set in Android Studio's device manager (Test device is Pixel 8)

After installing Android Studio, ensure that the `adb` command works. `adb` is the Android Development Bridge that allows Expo to connect and open the Android emulator.

```bash
adb devices
```

If it says `adb: command not found` or similar, then `adb` and other android utilities are not in the system's environment variables.

#### System Environment Variables (MacOS and Linux)

If you are on MacOS or Linux, add this to your `.bashrc` or `.zshrc`.

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk  # Or where the android SDK is installed
export ANDROID_SDK_ROOT=$ANDROID_HOME
export PATH=$ANDROID_HOME/platform-tools:$PATH
export PATH=$ANDROID_HOME/emulator:$PATH
```

Then reset the file.

```bash
source .zshrc  # or .bashrc
```

#### System Environment Variables (Windows)

Find the location of the android SDK, then edit the path by going to the System Environment Variables and setting it up in the GUI.

### Installation

After `git clone`ing the project, first install the dependencies necessary with `npm`.

```bash
npm install
```

This should install the dependencies for the monorepo and also everything in the react native app. Then go to the api app directory.

```bash
cd apps/api
```

Create a virtual environment with python, and then install the dependencies as stated in requirements.txt. A cross-platform setup script will be created later to simplify this.

```bash
python3 -m venv .venv
source .venv/bin/activate  # MacOS/Linux
# or .venv\Scripts\activate  # Windows

pip install --upgrade pip
pip install -r requirements.txt
```

Then, for VS code users, Select the Python Interpreter and choose "Use Python from `python.defaultInterpeterPath` setting" to make the language server lint properly.

To open and start the application, use `npm run start` on each of the workspaces.

```bash
npm run start --woekspace=apps/mobile  # Opens only mobile app
npm run start --package=apps/api  # Opens only API
npm run start   # Opens both at the same time (Recommended)
```

Once the mobile app is open, the Expo CLI will pop up showing the controls. Press `a` to open the android emulator. iOS is not tested. The API can also be accessed by going to `http://127.0.0.1:3000`. Press CTRL+C to close both processes.
