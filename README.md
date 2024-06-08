1. npm install
2. npm install cypress --save-dev
3. npx cypress open or you can use commands in package.json file :

 {...
    "cy:open": "cypress open",
    "cy:run": "cypress run --browser chrome",
...}
