import { JSDOM } from "jsdom";

export const parseStringToDocument = (str: string): Document => {
  const dom = new JSDOM(str);
  return dom.window.document;
};
