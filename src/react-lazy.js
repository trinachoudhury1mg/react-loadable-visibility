import React, { Component } from "react";
import {lazy} from "React";
import createLazyVisibiltyComponents from "./createLazyVisibiltyComponents";
import { IntersectionObserver } from "./capacities";


function lazyVisiblity(load, opts = {}, intersectionObserverOptions) {
  if (IntersectionObserver) {
    return createLazyVisibiltyComponents([load, opts], {
      Lazy: lazy,
      LoadingComponent: opts.fallback ? () => opts.fallback : null,
      intersectionObserverOptions,
    });
  }
} else {
  const LazyComponent = lazy(load);

  return( 
  <Suspense fallback={opts?.fallback}>
    <LazyComponent/>
  </Suspense>
  )
}

module.exports = lazyVisiblity;
