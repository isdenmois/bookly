import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { EmptyBook } from './EmptyBook';
import { notImplemented } from '../../../constants/not-implemented-yet';

interface Props extends NavigationScreenProps {
}

export class CurrentBook extends React.Component<any> {
    render() {
        return (
            <EmptyBook onChooseBook={notImplemented}/>
        );
    }
}
