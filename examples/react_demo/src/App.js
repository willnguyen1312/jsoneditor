import React, { useState, useEffect, useRef } from "react";
import { Heading, Flex, Box, Button } from "@chakra-ui/react";
import normalize from "json-api-normalizer";

import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css";

export default function App() {
  const [jsonState, setJsonState] = useState({
    array: [1, 2, 3],
    boolean: true,
    null: null,
    number: 123,
    object: { a: "b", c: "d" },
    string: "Hello World",
  });

  const leftJsonEditorRef = useRef();
  const leftJsonRef = useRef();

  const rightJsonEditorRef = useRef();
  const rightJsonRef = useRef();

  useEffect(() => {
    const options = {
      mode: "code",
    };

    leftJsonEditorRef.current = new JSONEditor(leftJsonRef.current, options);
    leftJsonEditorRef.current.set(jsonState);

    return () => {
      if (leftJsonEditorRef.current) {
        leftJsonEditorRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    const options = {
      mode: "code",
    };

    rightJsonEditorRef.current = new JSONEditor(rightJsonRef.current, options);
    rightJsonEditorRef.current.set(jsonState);

    return () => {
      if (rightJsonEditorRef.current) {
        rightJsonEditorRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (rightJsonEditorRef.current) {
      rightJsonEditorRef.current.update(jsonState);
    }
  }, [jsonState]);

  const onNormalizeClick = () => {
    if (leftJsonEditorRef.current) {
      try {
        const newJson = JSON.parse(leftJsonEditorRef.current.getText());
        const normalizedJson = normalize(newJson);
        setJsonState(normalizedJson);
      } catch (error) {}
    }
  };

  return (
    <Flex direction="column" alignItems="center" mt={8}>
      <Heading mb={4}>JSON:API Normalization 🎉</Heading>
      <Flex alignItems="center">
        <Flex direction="column">
          <Box w="500px" h="600px" ref={leftJsonRef} />
        </Flex>
        <Button colorScheme="pink" mx={12} onClick={onNormalizeClick}>
          Normalize
        </Button>
        <Box w="500px" h="600px" ref={rightJsonRef} />
      </Flex>
    </Flex>
  );
}
