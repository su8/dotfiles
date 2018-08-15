Development and minification process:

In order to build highlightjs you must use **node** version above than 0.12.6

You can add more bash keywords that will be highlighted, add them [here](https://github.com/wifiextender/wifiextender.github.io/blob/master/dev/main#L64)

```bash

npm install
npm run setup

# Adjust your text editor to run the following cmd
# whenever you save the changes in geminiblog.js
# or just run the code in "while... sleep X" loop.
# there are no gulp,grunt,browserify,beefy deps. in here

cd /to/this/dir; npm run build

# Clean up your mess once done
npm run clean

```

The `npm run` scripts are invoking the following bash script.

```bash

npm install
chmod +x main
./main setup

./main build

./main clean

```

The **src** directory contains the source code used to build geminiblog.
