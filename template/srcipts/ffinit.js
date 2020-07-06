#!/usr/bin/env node
const argv = require('yargs').argv

if (!argv.apiUserToken) {
    console.error("[ERROR] A valid API User Token is required")
    console.error("---------------------------------------------------")
    console.error("     This is specified with : --apiUserToken=[YOUR API USER TOKEN]")
    console.error("     See documentation: https://developers.flowfact.com/quick-start/create-API-user ");
    console.error("     For a deeplink to the API User Manager in FLOWFACT : https://apps.flowfact.com/settings/apiAccess")
    console.error("\n\n\n")
}

if (!argv.schema) {
    console.error("[ERROR] A valid schema is required")
    console.error("---------------------------------------------------")
    console.error("     This is specified with : --schema=[THE SCHEMA]. ex. --schema=contacts")
    console.error("     See documentation: https://developers.flowfact.com/api-service/rapidoc/dynamic-layout-service ");
    console.error("     For a deeplink to the Schema Manager in FLOWFACT : https://apps.flowfact.com/settings/schemas")
    console.error("\n\n\n")
}

const write = require('write');
const faker = require('faker');

write.sync('./src/config/init.json', JSON.stringify({
    apiUserToken: argv.apiUserToken,
    schema: argv.schema,
    widget: {
        kind: "widget",
        type: "FRAMED",
        configuration: {
            url: "http://localhost:3000",
            moduleKey: faker.random.alphaNumeric(10)
        },
        id: faker.random.uuid()
    }
}), { newline: true });

