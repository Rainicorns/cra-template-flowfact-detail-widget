#!/usr/bin/env node
try {
    const settings = require('../src/config/init.json')
    const widgetID = settings.widget.id;
    console.log("Retargeting widget id: ", widgetID)

    const fetch = require('node-fetch');

    const argv = require('yargs').argv
    if (!argv.url) {
        console.error("[ERROR] You need a new URL")
        console.error("---------------------------------------------------")
        console.error("     This is specified with : --url=[THE URL]. ex. --url='http://mytestflowfactwidgets3bucket.s3-website.eu-central-1.amazonaws.com/'")
        console.error("\n\n\n")
        return;
    } else {
        const newURL = argv.url;

        async function work() {

            const cognitoToken = await fetch('https://api.production.cloudios.flowfact-prod.cloud/admin-token-service/stable/public/adminUser/authenticate', {
                method: 'get',
                headers: {
                    "token": settings.apiUserToken,
                    "content-type": "application/json; charset=utf-8"
                }
            }).then(r => r.text());
            const layout = await fetch('https://api.production.cloudios.flowfact-prod.cloud/dynamic-layout-service/stable/widget-layouts?schema=contacts', {
                method: 'get',
                headers: {
                    cognitoToken,
                    "content-type": "application/json; charset=utf-8",
                    "Accept": "application/json"
                }
            }).then(r => r.json()).then(r => r.items[0])

            var didSomething = false;
            layout.layout.columns = layout.layout.columns.map(column => {
                column.children = column.children.map(widget => {
                    if (widget.id === widgetID) {
                        widget.configuration.url = newURL;
                        didSomething = true;
                        console.log("New Widget Config: ", widget);
                    }
                    return widget;
                })
                return column;
            })

            if(!didSomething) {
                console.log("Didn't find your widget in the layout. Did you add it?");
                return;
            }

            const results = await fetch("https://api.production.cloudios.flowfact-prod.cloud/dynamic-layout-service/stable/widget-layouts/contacts", {
                method: 'put',
                headers: {
                    cognitoToken,
                    "content-type": "application/json; charset=utf-8",
                    "Accept": "application/json"
                },
                body: JSON.stringify(layout)
            })


            // console.log(JSON.stringify(layout.layout))

        }
        work();
    }
} catch (err) {
    console.error("Problem loading settings file. Make sure you've run init.")
}