import ReactDOMServer from "react-dom/server";

export default function getStaticHTMLfromJSX(jsx: React.ReactElement): string {
  return ReactDOMServer.renderToStaticMarkup(jsx);
}
