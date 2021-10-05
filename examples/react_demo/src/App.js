import React, { useState, useEffect, useRef } from "react";
import { Heading, Flex, Box, Button } from "@chakra-ui/react";
import normalize from "json-api-normalizer";
// import Jsona from "jsona";

// const dataFomatter = new Jsona();

import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css";

const initialData = {
  links: {
    self: "http://example.com/articles",
    next: "http://example.com/articles?page[offset]=2",
    last: "http://example.com/articles?page[offset]=10",
  },
  data: [
    {
      type: "articles",
      id: "1",
      attributes: {
        title: "JSON:API paints my bikeshed!",
      },
      relationships: {
        author: {
          links: {
            self: "http://example.com/articles/1/relationships/author",
            related: "http://example.com/articles/1/author",
          },
          data: { type: "people", id: "9" },
        },
        comments: {
          links: {
            self: "http://example.com/articles/1/relationships/comments",
            related: "http://example.com/articles/1/comments",
          },
          data: [
            { type: "comments", id: "5" },
            { type: "comments", id: "12" },
          ],
        },
      },
      links: {
        self: "http://example.com/articles/1",
      },
    },
  ],
  included: [
    {
      type: "people",
      id: "9",
      attributes: {
        firstName: "Dan",
        lastName: "Gebhardt",
        twitter: "dgeb",
      },
      links: {
        self: "http://example.com/people/9",
      },
    },
    {
      type: "comments",
      id: "5",
      attributes: {
        body: "First!",
      },
      relationships: {
        author: {
          data: { type: "people", id: "2" },
        },
      },
      links: {
        self: "http://example.com/comments/5",
      },
    },
    {
      type: "comments",
      id: "12",
      attributes: {
        body: "I like XML better",
      },
      relationships: {
        author: {
          data: { type: "people", id: "9" },
        },
      },
      links: {
        self: "http://example.com/comments/12",
      },
    },
  ],
};

const normalizedData = normalize(initialData);

export default function App() {
  const leftJsonEditorRef = useRef();
  const leftJsonRef = useRef();

  const rightJsonEditorRef = useRef();
  const rightJsonRef = useRef();

  useEffect(() => {
    const options = {
      mode: "code",
    };

    leftJsonEditorRef.current = new JSONEditor(leftJsonRef.current, options);
    leftJsonEditorRef.current.set(initialData);

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
    rightJsonEditorRef.current.set(normalizedData);

    return () => {
      if (rightJsonEditorRef.current) {
        rightJsonEditorRef.current.destroy();
      }
    };
  }, []);

  const onNormalizeClick = () => {
    if (leftJsonEditorRef.current) {
      try {
        const newJson = JSON.parse(leftJsonEditorRef.current.getText());
        // const normalizedJson = normalize(newJson);
        const normalizedJson = normalize(newJson);
        if (normalizedJson) {
          rightJsonEditorRef.current.set(normalizedData);
        }
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
