import { Anchor, Flex, Group, Switch, Title } from '@mantine/core';
import { useField } from '@mantine/form';
import { createFileRoute, Link } from '@tanstack/react-router'
import logo from '@/assets/odoo-automation.svg';

export const Route = createFileRoute('/')({
  component: Index,
  loader: async () => {
    const options = await sendMessage('getOptions');
    return { options };
  }
})


function Index() {

  const { options } = Route.useLoaderData();

  const field = useField({
    initialValue: options?.autoInvoice === 'true' ? true : false,
    async onValueChange(value) {
      await sendMessage('setOptions', { options: { autoInvoice: value ? 'true' : 'false' } });
    }
  });

  return (
    <Flex gap='sm' justify='center' align='stretch' direction='column'>

      <Flex justify='center' align='center'>
        <img src={logo} alt='odoo automation logo' style={{ height: 140, marginBottom: -10 }} />
      </Flex>

      <Flex justify='center' align='center'>
        {!options?.customer ?
          (<Title order={4}>No Customer Selected</Title>) :
          (<Title order={5} style={{ textTransform: 'uppercase' }}>{options.customer.name}</Title>)
        }
      </Flex>

      <Flex justify='center' align='center' my='sm'>
        <Switch label='Auto Invoice' checked={field.getValue()}
          onChange={(event) => field.setValue(event.currentTarget.checked)} />
      </Flex>

      <Group justify='center' gap='xs' mt='md'>
        <Anchor component='a' target='_blank' href='https://github.com/Ayman-Elfaki/Odoo-Automate'>Source</Anchor>
        <div>-</div>
        <Anchor component={Link} href='/privacy'>Privacy</Anchor>
      </Group>
    </Flex>
  )
}