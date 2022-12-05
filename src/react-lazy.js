import React from "react";
import {lazy,Suspense} from "React";
import createLazyVisibiltyComponents from "./createLazyVisibiltyComponents";
import { IntersectionObserver } from "./capacities";


function createLazy(load,fallback){
  const LazyComponent = lazy(load);
  function ComponentLazy(props){
  return(<Suspense fallback={fallback}><LazyComponent {...props} /></Suspense>)
}
return ComponentLazy
}

function lazyVisiblity(load, opts = {}, intersectionObserverOptions) {
  if (IntersectionObserver) {
    return createLazyVisibiltyComponents([load, opts], {
      Lazy: lazy,
      LoadingComponent: opts.fallback ? () => opts.fallback : null,
      intersectionObserverOptions,
    });
  }
else {
  return createLazy(load,opts.fallback)
}
}

module.exports = lazyVisiblity;
