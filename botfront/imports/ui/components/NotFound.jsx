import {Container, Header} from "semantic-ui-react";
import React from "react";
import { i18n } from 'meteor/universe:i18n';

export default class NotFound extends React.Component {

    render() {
        return (
            <Container textAlign="center">
                <Header as="h1" >
                    {i18n.__('not_found')}
                </Header>

            </Container>
        )
    }
}
