import { Anchor, Stack, Text, Title } from '@mantine/core'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/privacy')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <Stack justify='center' align='center'>
            <Title order={2} >Privacy Policy</Title>
            <Text ta='justify'>
                We are committed to protecting your privacy and ensuring transparency about how the Extension operates.
                The Extension is designed solely to automate repetitive actions within Odoo instances based on user-defined rules.
                It does not collect, store, or transmit personal data.
            </Text>
            <Text fw={700}>© Copyright are Reserved</Text>
            <Anchor component={Link} href='/'>Back</Anchor>
        </Stack>
    )
}
