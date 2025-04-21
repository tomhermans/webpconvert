# WebP Converter - Installation and Usage Guide

This guide will walk you through installing and using the WebP converter tool globally on your system.

## Installation

1. Create a new directory for your project:
   ```bash
   mkdir webpconvert
   cd webpconvert
   ```

2. Save the `webpconvert.js` and `package.json` files to this directory.

3. Make the script executable:
```bash
   chmod +x webpconvert.js
   ```

4. Install the dependencies:
```bash
   npm install
   ```

5. Install the package globally:
```bash
   npm install -g .
   ```

Note: You might need to use `sudo` on Linux / Mac:
```bash
   sudo npm install -g .
   ```

## Usage

Once installed, you can run the `webpconvert` command from anywhere on your system:

### Convert a single file

   ```bash
webpconvert image.webp
```

This will convert `image.webp` to JPG and save it in a`converted` folder in the same directory.

### Specify output format

   ```bash
webpconvert image.webp -f png
# OR
webpconvert image.webp -f p
```

You can use `-f` or `--format` followed by`jpg`, `png`, `j`(shorthand for jpg), or`p`(shorthand for png).

### Convert all WebP files in a directory

   ```bash
webpconvert -i /path/to/images
```

This will convert all WebP files in the specified directory and save them to an output folder with a timestamp.

### Get help

   ```bash
webpconvert --help
```

## Examples

   ```bash
# Convert a single WebP file to JPG
webpconvert my-image.webp

# Convert a single WebP file to PNG
webpconvert my-image.webp -f png
# OR shorthand
webpconvert my-image.webp -f p

# Convert all WebP files in the current directory
webpconvert -i .

# Convert all WebP files in a specific directory to PNG
webpconvert -i ~/Pictures/webp-images -f png
```

## Troubleshooting

If you encounter any issues:

1. Make sure the sharp library is properly installed:
```bash
   npm install sharp
   ```

2. Check that the script has executable permissions:
```bash
   chmod +x webpconvert.js
   ```

3. If you get a "command not found" error, make sure the global npm bin directory is in your PATH.