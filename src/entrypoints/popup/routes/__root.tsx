import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Box, Grid } from '@mantine/core';

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <Box px='md' m='md' w='360' h='100%'>
      <Outlet />
    </Box >
  )
}