#!/usr/bin/env node
try {
    const settings = require('../src/config/init.json')
    // console.log("Using settings : ", JSON.stringify(settings))

    const widgetID = settings.widget.id;
    console.log("Removing widget id: ", widgetID)

    const fetch = require('node-fetch');

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

        layout.layout.columns = layout.layout.columns.map(column => {
            column.children = column.children.filter(widget => {
                if (widget.id === widgetID) {
                    console.log("Removing : ", widget)
                }
                return widget.id !== widgetID;
            })
            return column;
        })

        const results = await fetch("https://api.production.cloudios.flowfact-prod.cloud/dynamic-layout-service/stable/widget-layouts/contacts", {
            method: 'put',
            headers: {
                cognitoToken,
                "content-type": "application/json; charset=utf-8",
                "Accept": "application/json"
            },
            body: JSON.stringify(layout)
        })


        console.log(JSON.stringify(layout.layout))

    }
    work();
} catch (err) {
    console.error("Problem loading settings file. Make sure you've run init.")
}