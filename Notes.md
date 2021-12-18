{/_ <Flex p="2" maxWidth="100%">
<IconButton
ml="3"
mt="3"
aria-label="Toggle Color Mode"
size="sm"
position="fixed"
top="0"
left="0"
onClick={toggleColorMode}
icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
/>
<Container d="flex" flex="0" align="center" justify="center">
<ButtonGroup isAttached>
<Button to="/" as={NavLink} size="sm">
Home
</Button>
<Button to="/editor" as={NavLink} size="sm">
Editor
</Button>
</ButtonGroup>
</Container>
</Flex> _/}
