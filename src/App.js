import React, { useState, useEffect } from 'react';
import postRobot from 'post-robot';
import { Authentication, EnvironmentManagement, EntityService as Service } from '@flowfact/api-services'
import { reactLocalStorage } from 'reactjs-localstorage';
import Widget from './Widget';
import settings from './config/init.json'

function App() {
  const [entityID, setEntityID] = useState(0);
  const [schemaID, setSchemaID] = useState(0);
  const [isAuth, setIsAuth] = useState(false);
  const [tokens, setTokens] = useState(false);

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

    console.log("SETTINGS : ",settings)

    postRobot.on(`initial_${settings.widget.configuration.moduleKey}`, async ({ data }) => {
      EnvironmentManagement.stage = data.environment.stage
      EnvironmentManagement.version = data.environment.versionTag
      reactLocalStorage.setObject('fftokens', data.tokens);
      setTokens(data.tokens);

    });
    postRobot.send(window.parent, `ready_${settings.widget.configuration.moduleKey}`, true);
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
      {isAuth && entityID && schemaID && <EntityGetter entityID={entityID} schemaID={schemaID} />}
    </>
  )
}
export default App;
