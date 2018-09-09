import { Alert } from 'react-native';
import { notImplemented } from '../not-implemented-yet';

describe('not-implemented', function () {
    beforeEach(function () {
        jest.spyOn(Alert, 'alert');
    });

    it('should call alert', function () {
        notImplemented();

        expect(Alert.alert).toHaveBeenCalledWith('Еще не реализовано', 'Данный функционал будет доступен в следующей версии');
    });
});
