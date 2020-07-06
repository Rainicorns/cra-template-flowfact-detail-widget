#!/usr/bin/env node
const argv = require('yargs').argv
const settings = require('../src/config/init.json')

if (argv.apiUserToken) {
    settings["apiUserToken"] = argv.apiUserToken
}

console.log("Args : ", argv, settings)

const fetch = require('node-fetch');

async function main() {


    if (!argv.column) {
        console.error("[WARNING] No column provided. Assuming column index=0")
        console.error("---------------------------------------------------")
        console.error("     This is specified with : --column=[THE Column].")
        console.error("\n\n\n")
        argv.column = 0;
    }



    const token = settings.apiUserToken;
    // exchange api token
    const cognitoToken = await fetch('https://api.production.cloudios.flowfact-prod.cloud/admin-token-service/stable/public/adminUser/authenticate', {
        method: 'get',
        headers: {
            token,
            "content-type": "application/json; charset=utf-8"
        }
    }).then(r => r.text());
    console.log(cognitoToken);

    // fetch layout of schema
    const layoutURL = `https://api.production.cloudios.flowfact-prod.cloud/dynamic-layout-service/stable/widget-layouts?schema=${settings.schema}`
    console.log("Calling FF Platform : ", layoutURL)
    const layout = await fetch(layoutURL, {
        method: 'get',
        headers: {
            cognitoToken,
            "content-type": "application/json; charset=utf-8",
            "Accept": "application/json"
        }
    }).then(r => r.json())
        .then(r => r.items[0])
    console.log('Layout : ', layout)

    // get column
    const faker = require('faker');
    const column = layout.layout.columns[argv.column]
    const widgetDefinition = settings.widget;
    column.children.push(widgetDefinition)
    console.log('column : ', column, widgetDefinition)

    // add the widget
    const results = await fetch(`https://api.production.cloudios.flowfact-prod.cloud/dynamic-layout-service/stable/widget-layouts/${settings.schema}`, {
        method: 'put',
        headers: {
            cognitoToken,
            "content-type": "application/json; charset=utf-8",
            "Accept": "application/json"
        },
        body: JSON.stringify(layout)
    })

    console.log("Results : ", results)


}
main();
