import React, { Component } from "react";
import loadable from "@loadable/component";
import createLoadableVisibilityComponent from "./createLoadableVisibilityComponent";
import { IntersectionObserver } from "./capacities";

function loadableVisiblity(
  load,
  opts = {},
  intersectionObserverOptions = {
    root: null,
    rootMargin: "0px 0px 0px 0px",
    threshold: 0,
  }
) {
  if (IntersectionObserver) {
    return createLoadableVisibilityComponent([load, opts], {
      Loadable: loadable,
      preloadFunc: "preload",
      LoadingComponent: opts.fallback ? () => opts.fallback : null,
      intersectionObserverOptions,
    });
  } else {
    return loadable(load, opts);
  }
}

module.exports = loadableVisiblity;
