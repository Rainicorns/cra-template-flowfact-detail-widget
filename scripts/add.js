#!/usr/bin/env node
const argv = require('yargs').argv
const settings = require('../json/init.json')

if (argv.apiUserToken) {
    settings["apiUserToken"] = argv.apiUserToken
}

console.log("Args : ", argv, settings)

const fetch = require('node-fetch');

async function main() {

    const token = settings.apiUserToken;
    // exchange api token
    const cognitoToken = await fetch('https://api.production.cloudios.flowfact-prod.cloud/admin-token-service/stable/public/adminUser/authenticate', {
        method: 'get',
        headers: {
            token,
            "content-type": "application/json; charset=utf-8"
        }
    }).then(r => r.text());
    // console.log(cognitoToken);

    // fetch layout of schema
    const layout = await fetch('https://api.production.cloudios.flowfact-prod.cloud/dynamic-layout-service/stable/widget-layouts?schema=contacts', {
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
    const column = layout.layout.columns[1]
    const widgetDefinition = settings.widget;
    column.children.push(widgetDefinition)
    console.log('column : ', column, widgetDefinition)

    // add the widget
    const results = await fetch("https://api.production.cloudios.flowfact-prod.cloud/dynamic-layout-service/stable/widget-layouts/contacts",{
        method: 'put',
        headers: {
            cognitoToken,
            "content-type": "application/json; charset=utf-8",
            "Accept": "application/json"
        },
        body:JSON.stringify(layout)
    })

    console.log("Results : ", results)


}
main();
