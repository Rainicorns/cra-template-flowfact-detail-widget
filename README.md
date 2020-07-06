So you want to create a FLOWFACT Widget!

Before you can start, there are a few thinsg to do
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
