import { navigation } from '../navigation';

describe('Navigator service', () => {
  let mock = {
    dispatch: jest.fn(),
  };

  beforeAll(() => {
    navigation.setRef(mock);
  });

  beforeEach(() => {
    mock.dispatch.mockReset();
  });

  afterAll(() => {
    navigation.setRef(null);
    mock = null;
  });

  it('should create navigate action', () => {
    navigation.navigate('Screen1');

    expect(mock.dispatch).toHaveBeenCalledWith({
      type: 'Navigation/NAVIGATE',
      routeName: 'Screen1',
    });
  });

  it('should create stack pop action', () => {
    navigation.pop();

    expect(mock.dispatch).toHaveBeenCalledWith({
      type: 'Navigation/POP',
      immediate: undefined,
      n: undefined,
    });
  });

  it('should create stack pop-to-top action', () => {
    navigation.popToTop();

    expect(mock.dispatch).toHaveBeenCalledWith({
      type: 'Navigation/POP_TO_TOP',
    });
  });

  it('should create stack push action', () => {
    navigation.push('Screen2', { bookId: 1 });

    expect(mock.dispatch).toHaveBeenCalledWith({
      type: 'Navigation/PUSH',
      routeName: 'Screen2',
      params: { bookId: 1 },
    });
  });
});
