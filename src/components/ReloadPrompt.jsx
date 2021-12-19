import React from 'react';
import {
  Box,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Text,
} from '@chakra-ui/react';

import { useRegisterSW } from 'virtual:pwa-register/react';

function ReloadPrompt() {
  // replaced dynamically
  const buildDate = '__DATE__';
  console.log(buildDate);
  // replaced dyanmicaly
  const reloadSW = '__RELOAD_SW__';

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (reloadSW === 'true') {
        r && console.log('Checking for sw update');
        r.update();
      } else {
        // eslint-disable-next-line prefer-template
        console.log('SW Registered: ' + r);
      }
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <>
      {(offlineReady || needRefresh) && (
        <Alert
          maxW="max-content"
          size="sm"
          status="info"
          pos="fixed"
          bottom="1rem"
          right="1rem"
          marginInline="5"
          display="flex"
          flexFlow="column"
          alignItems="center"
          justifyContent="center"
        >
          <AlertIcon />
          <AlertDescription p="2">
            {offlineReady ? (
              <Text textAlign="center" fontSize="0.8rem">
                App ready to work offline
              </Text>
            ) : (
              <Text textAlign="center" fontSize="0.8rem">
                New content available, click on reload button to update.
              </Text>
            )}
          </AlertDescription>
          <Flex align="center" justify="center">
            {needRefresh && (
              <Button size="sm" m="2" onClick={() => updateServiceWorker(true)}>
                Reload
              </Button>
            )}
            <Button size="sm" m="2" onClick={() => close()} variant="outline">
              Close
            </Button>
          </Flex>
        </Alert>
      )}
    </>
  );
}

export default ReloadPrompt;
