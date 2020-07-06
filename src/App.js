import React, { useState, useEffect } from 'react';
import postRobot from 'post-robot';
import { Authentication, EnvironmentManagement, EntityService as Service } from '@flowfact/api-services'
import { reactLocalStorage } from 'reactjs-localstorage';
import JSONPretty from 'react-json-pretty';
import Widget from './Widget';
import settings from './config/init.json'

function App() {
  const [entityID, setEntityID] = useState(0);
  const [schemaID, setSchemaID] = useState(0);
  const [isAuth, setIsAuth] = useState(false);
  const [tokens, setTokens] = useState(false);
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
    if (reactLocalStorage.getObject('fftokens')) {
      setTokens(reactLocalStorage.getObject('fftokens'));
    }

    postRobot.on(`initial_${settings.widget.configuration.moduleKey}`, async ({ data }) => {
      EnvironmentManagement.stage = data.environment.stage
      EnvironmentManagement.version = data.environment.versionTag
      reactLocalStorage.setObject('fftokens', data.tokens);
      setTokens(data.tokens);
    });
    console.log("postRobot : ", postRobot);
    const res = postRobot.send(window.parent, `ready_${settings.widget.configuration.moduleKey}`, true)
      .catch(er => {
        console.error("Post Robot : ", er)
        setOutside(true)
      })

    console.log("Send : ", res)

    postRobot.on(`data_${settings.widget.configuration.moduleKey}`, async (event) => {
      setEntityID(event.data.entityId);
      setSchemaID(event.data.schemaId);
    });

  }, [])

  function EntityGetter() {
    const [entity, setEntity] = useState(0);
    useEffect(() => {
      (async () => {
        const results = await Service.fetchEntity(schemaID, entityID);
        setEntity(results.data);
      })();
    }, []);
    return <>{entity && <Widget entity={entity} />}</>
  }

  return (
    <>
      {outside ? (
        <div>
          <h1>Seems like you're trying to view the widget outside of FLOWFACT.</h1>
          <h2>That really isn't going to work. Trying viewing it INSIDE.</h2>
          <JSONPretty id="json-pretty" data={settings}></JSONPretty>
        </div>
      ) :
        (isAuth && entityID && schemaID) && <EntityGetter entityID={entityID} schemaID={schemaID} />}
    </>
  )
}
export default App;
