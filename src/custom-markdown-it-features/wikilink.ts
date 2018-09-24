/**
 * inline [[]]
 * [[...]]
 */

// tslint:disable-next-line no-implicit-dependencies
import { MarkdownIt } from "markdown-it";
import { MarkdownEngineConfig } from "../markdown-engine-config";

export default (md: MarkdownIt, config: MarkdownEngineConfig) => {
  // @ts-ignore
  md.inline.ruler.before("autolink", "wikilink", (state, silent) => {
    if (
      !config.enableWikiLinkSyntax ||
      !state.src.startsWith("[[", state.pos)
    ) {
      return false;
    }

    let content = null;
    const tag = "]]";
    let end = -1;

    let i = state.pos + tag.length;
    while (i < state.src.length) {
      if (state.src[i] === "\\") {
        i += 1;
      } else if (state.src.startsWith(tag, i)) {
        end = i;
        break;
      }
      i += 1;
    }

    if (end >= 0) {
      // found ]]
      content = state.src.slice(state.pos + tag.length, end);
    } else {
      return false;
    }

    if (content && !silent) {
      const token = state.push("wikilink");
      token.content = content;

      state.pos += content.length + 2 * tag.length;
      return true;
    } else {
      return false;
    }
  });

  md.renderer.rules.wikilink = (tokens, idx) => {
    const { content } = tokens[idx];
    if (!content) {
      return;
    }

    const splits = content.split("|");
    if (splits.length === 1) {
      const wikiLink = `${splits[0].trim()}${config.wikiLinkFileExtension}`
      const linkText = splits[0].trim();
      return `<a href="${wikiLink}">${linkText}</a>`;
    }
    else {
      const wikiLink = `${splits[0].trim()}${config.wikiLinkFileExtension}`
      const linkText = splits[1].trim();
      return `<a href="${wikiLink}">${linkText}</a>`;
    }
  };
};
