import React, { useEffect, useState } from 'react';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import settings from './config/init.json'
import { Authentication, EnvironmentManagement } from '@flowfact/api-services'
import postRobot from 'post-robot';
import JSONPretty from 'react-json-pretty';
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { reactLocalStorage } from 'reactjs-localstorage';

import Widget from './widget/Widget';
import WidgetConfig from './widget/WidgetConfig';

function App() {
  const [entityID, setEntityID] = useState(0);
  const [schemaID, setSchemaID] = useState(0);
  const [isAuth, setIsAuth] = useState(false);
  const [tokens, setTokens] = useState(false);
  const [theme, setTheme] = useState(false);
  const [outside, setOutside] = useState(false);

  useEffect(() => {
    (async () => {
      if (tokens) {
        await Authentication.loginWithTokens(tokens)
        setIsAuth(true);
      }
    })()
  }, [tokens])

  useEffect(() => {
    // if the app refreshes without postrobot, we want to see if there was a previous registration with postrobot
    // we do this so that the auth info is always available
    if (reactLocalStorage.getObject('fftokens')) {
      setTokens(reactLocalStorage.getObject('fftokens'));
    }

    // the initial data sent via post robot
    // see: https://flowfact.atlassian.net/wiki/spaces/RD/pages/1158578181/Create+your+own+widget
    // TODO: This is an internal doc, still waiting for the public external doc
    postRobot.on(`initial_${settings.widget.configuration.moduleKey}`, async ({ data }) => {
      setTheme(data.muiTheme)

      console.log("MUI THEME : ", data.muiTheme);

      EnvironmentManagement.stage = data.environment.stage
      EnvironmentManagement.version = data.environment.versionTag
      reactLocalStorage.setObject('fftokens', data.tokens);
      setTokens(data.tokens);
    });

    // send the ready to parent container
    postRobot.send(window.parent, `ready_${settings.widget.configuration.moduleKey}`, true)
      .catch(er => setOutside(true))

    // handle the container sending data to us
    postRobot.on(`data_${settings.widget.configuration.moduleKey}`, async (event) => {
      setEntityID(event.data.entityId);
      setSchemaID(event.data.schemaId);
    });
  }, [])

  return (
    <Router>
      <ThemeProvider theme={createMuiTheme(theme)}>
        {outside ? (
          <div>
            <h1>[Warning] Seems like you're trying to view the widget outside of FLOWFACT.</h1>
            <h2>That really isn't going to work. Trying viewing it INSIDE.</h2>
            <JSONPretty id="json-pretty" data={settings}></JSONPretty>
          </div>
        ) :
          <Switch>
            <Route path="/config">
              <WidgetConfig schemaID={schemaID} entityID={entityID} />
            </Route>
            <Route path="/">
              {(isAuth && entityID && schemaID) &&
                (
                  // <EntityGetter entityID={entityID} schemaID={schemaID} />
                  <Widget schemaID={schemaID} entityID={entityID} />
                )
              }
            </Route>
          </Switch>
        }
      </ThemeProvider>
    </Router>
  )
}
export default App;
