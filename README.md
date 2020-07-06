# So you want to create a FLOWFACT Widget!
## FLOWFACT Detail Page Widget Starter Kit

The project "cra-template-flowfact-detail-widget" is an opinionated create-react-app custom template that allows you to start coding your widget. It includes scripts to help *initialize*, *add*, and *remove* your widget from your detail page layout.

To start a new template:

### Npm
    npx create-react-app your-widget-name --template flowfact-detail-widget

### Yarn
    yarn create react-app your-widget-name --template flowfact-detail-widget

The project supports both javascript and typescript out of the box.

Before you can start coding:
1. Initialize your widget configuration with your API User Token and Schema ID

    `yarn ffinit --apiUserToken=d41b9ff6-c221-4e7e-83af-5c757991372b --schema=contacts`

    The documentation around FLOWFACT Api Users:
        https://developers.flowfact.com/quick-start/create-API-user

1. Add your widget to the detail page
    
    `yarn ffadd`

    This script reads the information from the previous `ffinit` command to pull the layout for the Schema you've specified. It adds the widget to the bottom of this page.

1. Start a local server to serve your widget

    `yarn start`

    This will create an endpoint. It will open a browser tab that will error because of the lack of postrobot, but it should be visible in the detail page of your schema.

1. See your widget in the detail page of the Schema

    If you navigate to the detail of an entity in the schema you've specified, you should see your widget.

4. Modify `Widget.js` or `Widget.tsx`

    You're good to go for both javascript and typescript

5. If you ever want to remove the widget

    `yarn ffremove`

    This will remove your widget from the layout.

## Publishing your widget on AWS S3
This assumes you have the aws-cli installed locally. If not here is a link to the AWS CLI documentation: 
https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html

This also assumes that you've created a S3 Bucket to deploy into. If not, here's an article on how to do that:
https://medium.com/serverlessguru/deploy-reactjs-app-with-s3-static-hosting-f640cb49d7e6

1. First prepare a production build
    
    `yarn build`

1. Push to S3

    `aws s3 sync build/ s3://[YOUR BUCKET]  --acl public-read;`

    Example: `aws s3 sync build/ s3://mytestflowfactwidgets3bucket  --acl public-read;`

1. Adjust the widget url from localhost to your S3 URL

    `yarn ffretarget --url=[YOUR S3 URL]`

    Example: http://mytestflowfactwidgets3bucket.s3-website.eu-central-1.amazonaws.com/




## Typescript
Just rename your `Widget.js` to `Widget.tsx` and put in required types (or vice versa!). The project supports both jsx and tsx.
