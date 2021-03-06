import { resolve } from "path";
import { extensionDirectoryPath } from "./utility";

/* tslint:disable-next-line:no-var-requires */
const _VIZ = require(resolve(
  extensionDirectoryPath,
  "./dependencies/viz/viz.js",
));

/* tslint:disable-next-line:no-var-requires */
const { Module, render } = require(resolve(
  extensionDirectoryPath,
  "./dependencies/viz/full.render.js",
));

let viz = new _VIZ({ Module, render });
/**
 *
 * @param renderOption https://github.com/mdaines/viz.js/wiki/API#render-options
 */
export async function Viz(digraph: string, renderOption: object) {
  try {
    return await viz.renderString(digraph, renderOption);
  } catch (error) {
    // Create a new Viz instance (@see Caveats page for more info)
    viz = new _VIZ({ Module, render });
    throw error;
  }
}
