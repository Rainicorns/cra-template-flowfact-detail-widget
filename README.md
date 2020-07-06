# So you want to create a FLOWFACT Widget!
## FLOWFACT Detail Page Widget Starter Kit

The project "cra-template-flowfact-detail-widget" is an opinionated create-react-app custom template that allows you to start coding your widget. It includes scripts to help *initialize*, *add*, and *remove* your widget from your detail page layout.

To start a new template:

npx create-react-app your-widget-name --template flowfact-detail-widget
# or
yarn create react-app your-widget-name --template flowfact-detail-widget

The project supports both javascript and typescript out of the box.

Before you can start coding:
1. Initialize your widget configuration with your API User Token and Schema ID
- yarn ffinit --apiUserToken=d41b9ff6-c221-4e7e-83af-5c757991372b --schema=contacts

2. Add your widget to the detail page
- yarn ffadd

3. See your widget in the detail page of the Schema

4. Modify Widget.js
- You're good to go!

5. If you ever want to remove the widget
- yarn ffremove

# Typescript
Just rename your Widget.js to Widget.tsx and put in required types. The project supports both jsx and tsx.
