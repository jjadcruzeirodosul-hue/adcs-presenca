const CONFIG_BY_HOSTNAME = {
  "localhost": "./config/firebase-config.dev.js",
  "127.0.0.1": "./config/firebase-config.dev.js",

  "adcs-presenca-dev.web.app":
    "./config/firebase-config.dev.js",
  "adcs-presenca-dev.firebaseapp.com":
    "./config/firebase-config.dev.js",

  "adcs-presenca-qa.web.app":
    "./config/firebase-config.qa.js",
  "adcs-presenca-qa.firebaseapp.com":
    "./config/firebase-config.qa.js",

  "adcs-presenca-jiu-jitsu.web.app":
    "./config/firebase-config.prod.js",
  "adcs-presenca-jiu-jitsu.firebaseapp.com":
    "./config/firebase-config.prod.js"
};

const hostname = window.location.hostname;

const configModulePath = CONFIG_BY_HOSTNAME[hostname];

if (!configModulePath) {
  throw new Error(
    `[Firebase] Ambiente não reconhecido para o hostname: ${hostname}`
  );
}

const {
  firebaseConfig,
  firebaseEnvironment
} = await import(configModulePath);

export {
  firebaseConfig,
  firebaseEnvironment
};