import { Flex, Box, Avatar, Text } from '@chakra-ui/react';

interface ProfileProps {
  showProfileData?: boolean;
}

export function Profile({ showProfileData = false }: ProfileProps) {
  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>Eduardo Reichert</Text>
          <Text color="gray.300" fontSize="small">
            edrdesigner@gmail.com
          </Text>
        </Box>
      )}
      <Avatar
        size="md"
        name="Eduardo Reichert"
        src="https://github.com/edrdesigner.png"
      />
    </Flex>
  );
}
