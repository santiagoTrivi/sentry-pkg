#!/usr/bin/env node

const yargs = require("yargs");
const { exec } = require("child_process");
const { existsSync } = require("fs");

const executeCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${stderr}`);
      } else {
        resolve(stdout);
      }
    });
  });
};

// Main function to generate keys
const generateKeys = async (isforced) => {
  try {
    if (existsSync("private.key") && existsSync("public.key") && !isforced) {
      console.log("Keys already exist. Skipping key generation.");
      return;
    }

    console.log("Generating private key...");
    await executeCommand("openssl genrsa -out private.key 2048");
    console.log("Private key generated: private.key");

    console.log("Generating public key...");
    await executeCommand(
      "openssl rsa -in private.key -outform PEM -pubout -out public.key"
    );
    console.log("Public key generated: public.key");
  } catch (error) {
    console.error(error);
  }
};

if (yargs.argv.init) {
  generateKeys(yargs.argv.force || false);
}
