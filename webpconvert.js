#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const readline = require('readline');
const minimist = require('minimist');

// Parse command line arguments
const argv = minimist(process.argv.slice(2), {
   string: ['i', 'input'],
   boolean: ['h', 'help'],
   alias: {
      h: 'help',
      i: 'input',
      f: 'format'
   },
   default: {
      format: 'jpg'
   }
});

// Help text
const helpText = `
WebP Converter - Convert WebP images to JPG or PNG

Usage:
  webpconvert [options] [file.webp]

Options:
  -h, --help            Show this help message
  -i, --input <path>    Input directory (default: current directory)
  -f, --format <type>   Output format: jpg or png (default: jpg)
                        Can also use shorthand: j for jpg, p for png

Examples:
  webpconvert image.webp                 # Convert single file to jpg
  webpconvert image.webp -f png          # Convert single file to png
  webpconvert -i ./images                # Convert all WebP files in directory
  webpconvert -i ./images -f png         # Convert all WebP files to png
`;

// Show help if requested or no arguments provided
if (argv.help) {
   console.log(helpText);
   process.exit(0);
}

// Format detection (support shorthand j/p)
function normalizeFormat(format) {
   if (!format) return 'jpg';
   format = format.toLowerCase();
   if (format === 'j') return 'jpg';
   if (format === 'p') return 'png';
   if (format === 'jpg' || format === 'png') return format;

   console.log(`Invalid format: ${format}. Using jpg as default.`);
   return 'jpg';
}

const outputFormat = normalizeFormat(argv.format);

// Create readline interface for interactive mode
const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout
});

function askQuestion(query) {
   return new Promise(resolve => rl.question(query, resolve));
}

// Function to convert a single file
async function convertFile(inputPath, outputFormat) {
   try {
      const fileInfo = path.parse(inputPath);

      // Create output folder if it doesn't exist
      const outputFolder = path.join(fileInfo.dir, 'converted');
      if (!fs.existsSync(outputFolder)) {
         fs.mkdirSync(outputFolder, { recursive: true });
      }

      const outputFileName = `${fileInfo.name}.${outputFormat}`;
      const outputPath = path.join(outputFolder, outputFileName);

      console.log(`Converting: ${path.basename(inputPath)}`);

      await sharp(inputPath)
         .toFormat(outputFormat)
         .toFile(outputPath);

      console.log(`Successfully converted: ${path.basename(inputPath)} -> ${outputFileName}`);
      console.log(`Saved to: ${outputPath}`);
      return true;
   } catch (err) {
      console.error(`Error converting ${path.basename(inputPath)}:`, err);
      return false;
   }
}

// Function to process a directory
async function processDirectory(inputFolder, outputFormat) {
   // Create output folder inside the input folder
   const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
   const outputFolder = path.join(inputFolder, `output_${timestamp}`);
   fs.mkdirSync(outputFolder, { recursive: true });

   console.log(`Input folder: ${inputFolder}`);
   console.log(`Output folder: ${outputFolder}`);
   console.log(`Output format: ${outputFormat}`);

   try {
      const files = fs.readdirSync(inputFolder);
      const webpFiles = files.filter(file => path.extname(file).toLowerCase() === '.webp');
      console.log(`Found ${webpFiles.length} WebP files to convert.`);

      if (webpFiles.length === 0) {
         console.log('No WebP files found to process.');
         return;
      }

      let processedCount = 0;
      let errorCount = 0;

      for (const file of webpFiles) {
         const inputPath = path.join(inputFolder, file);
         const outputFileName = `${path.parse(file).name}.${outputFormat}`;
         const outputPath = path.join(outputFolder, outputFileName);

         console.log(`Converting: ${file}`);

         try {
            await sharp(inputPath)
               .toFormat(outputFormat)
               .toFile(outputPath);

            console.log(`Successfully converted: ${file} -> ${outputFileName}`);
            processedCount++;
         } catch (err) {
            console.error(`Error converting ${file}:`, err);
            errorCount++;
         }
      }

      console.log(`\nConversion complete. ${processedCount} files converted, ${errorCount} errors.`);
   } catch (err) {
      console.error('Error reading input folder:', err);
   }
}

// Main function
async function main() {
   // Check if a specific file was provided
   const singleFile = argv._.length > 0 ? argv._[0] : null;

   if (singleFile) {
      // Process single file
      if (!fs.existsSync(singleFile)) {
         console.error(`Error: File not found: ${singleFile}`);
         process.exit(1);
      }

      if (path.extname(singleFile).toLowerCase() !== '.webp') {
         console.error(`Error: File is not a WebP image: ${singleFile}`);
         process.exit(1);
      }

      const success = await convertFile(singleFile, outputFormat);
      process.exit(success ? 0 : 1);
   } else {
      // Process directory
      const inputFolder = argv.input || process.cwd();

      if (!fs.existsSync(inputFolder)) {
         console.error(`Error: Directory not found: ${inputFolder}`);
         process.exit(1);
      }

      await processDirectory(inputFolder, outputFormat);
      process.exit(0);
   }
}

// Close readline interface when done
process.on('exit', () => {
   rl.close();
});

// Run the main function
main();