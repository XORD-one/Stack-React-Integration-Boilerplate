import React from 'react';
import ReactDOM from 'react-dom';
import WithHiroWallet from '@components/WithHiroWallet';
import { Provider } from 'react-redux';
import { store } from '@redux/configureStore';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <WithHiroWallet />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
