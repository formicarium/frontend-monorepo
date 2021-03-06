import React from 'react'
import { Button, Icon, Segment } from 'semantic-ui-react';
import { DevspaceList } from '../../components/DevspaceList';
import styled from 'styled-components';
import { SegmentHeader } from '~/modules/common/components/SegmentHeader';
import { PromiseManager } from '~/modules/common/render-props/PromiseManager';
import { WithFMCSystem } from '~/modules/common/components/WithFMCSystem';
import { devspaceToDevspaceConfig } from '@formicarium/common'
import { toast, ToastType } from 'react-toastify';
import { DisplayError } from '~/modules/common/components/DisplayError';
import { DevspaceListPlaceholder } from '~/modules/devspace/components/DevspaceList/index.shimmer';
import { RouteComponentProps } from 'react-router';

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const DevspacesPage: React.SFC<RouteComponentProps<{}>> = ({
  history,
}) => (
  <Segment>
    <SegmentHeader title='Devspaces' icon='list' />

    <ButtonWrapper>
      <Button color='green' onClick={() => history.push('/devspaces/create')}>
        <Icon name='add circle' />
        New devspace
      </Button>
    </ButtonWrapper>

    <WithFMCSystem>
      {(system) => (
        <PromiseManager
          promise={() => Promise.all([system.soilService.getDevspaces(), system.configService.readConfig()])}
          LoadingComponent={() => <DevspaceListPlaceholder n={5} />}
          ErrorComponent={DisplayError}>
          {({ data: [devspaces, config]}, refetch, patchData) => (
            <DevspaceList
              devspaces={devspaces}
              selectedDevspaceName={config.devspace.name}
              onDeleteDevspace={async (devspace) => {
                try {
                  await system.soilService.deleteDevspace(devspace.name)
                  toast('Success', {
                    type: 'success' as ToastType,
                  })
                  patchData([
                    devspaces.filter((dev) => dev.name !== devspace.name),
                    config,
                  ])
                } catch (err) {
                  toast('Error', {
                    type: 'error' as ToastType,
                  })
                }
              }}
              onUseDevspace={async (devspace) => {
                const devspaceConfig = devspaceToDevspaceConfig(devspace)
                try {
                  await system.configService.setDevspaceConfig(devspaceConfig)
                  patchData([
                    devspaces,
                    {
                      ...config,
                      devspace: {
                        ...config.devspace,
                        name: devspace.name,
                      },
                    },
                  ])
                } catch (err) {
                  toast('Error', {
                    type: 'error' as ToastType,
                  })
                }
              }}
            />
          )}
        </PromiseManager>
      )}
    </WithFMCSystem>
  </Segment>
)
