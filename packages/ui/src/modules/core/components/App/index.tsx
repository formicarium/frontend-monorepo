import React from 'react'
import './styles.css'
// import 'react-toastify/dist/ReactToastify.min.css';
import { Provider } from 'unstated';
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter } from 'react-router-dom';
import { client } from '../../../../system/apollo';
import { MainLayout } from '~/modules/core/MainLayout';
import { Dimmer, Loader } from 'semantic-ui-react';
import { SystemProvider } from '../SystemProvider';
import { Nullable, ISystem, getSystem } from 'common'

interface IState {
  system: Nullable<ISystem>
}

export class App extends React.Component<{}, IState> {
  constructor(props: {}) {
    super(props)
    this.state = {
      system: null,
    }
  }
  public async componentDidMount() {
    const system = await getSystem()

    this.setState({
      system,
    })
  }

  public render() {
    if (!this.state.system) {
      return (
        <Dimmer active>
          <Loader indeterminate>Booting system...</Loader>
        </Dimmer>
      )
    }

    return (
      <SystemProvider system={this.state.system}>
        <Provider>
          <ApolloProvider client={client}>
            <BrowserRouter>
              <MainLayout />
            </BrowserRouter>
          </ApolloProvider>
        </Provider>
      </SystemProvider>
    )
  }
}
