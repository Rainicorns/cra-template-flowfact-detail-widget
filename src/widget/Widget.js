import React, { useState, useEffect } from 'react'
import { EntityService } from '@flowfact/api-services'

import JSONPretty from 'react-json-pretty';
import './Widget.scss'

import { useHistory } from "react-router-dom";

import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';


export default function Widget({ schemaID, entityID }) {
    const history = useHistory();
    const [entity, setEntity] = useState({});
    useEffect(() => {
        (async () => {
            const results = await EntityService.fetchEntity(schemaID, entityID);
            setEntity(results.data);
        })();
    }, [schemaID, entityID]);
    return (
        <Container className="MyWidget">
            <h1>Hallochen,</h1>
            <h2>This is the entity: </h2>
            <Button color="primary" onClick={() => {
                history.push('/config')
            }}>Look at the config</Button>
            <JSONPretty id="json-pretty" data={entity}></JSONPretty>
        </Container>
    );
}