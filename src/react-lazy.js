import React from "react";
import {lazy,Suspense} from "React";
import createLazyVisibiltyComponents from "./createLazyVisibiltyComponents";
import { IntersectionObserver } from "./capacities";


function createLazy(load,fallback){
  const LazyComponent = lazy(load);
  function ComponentLazy(props){
  return(<Suspense fallback={<div>fallback</div>}><LazyComponent {...props} /></Suspense>)
}
return ComponentLazy
}

function lazyVisiblity(load, opts = {}, intersectionObserverOptions) {
  if (IntersectionObserver) {
    return createLazyVisibiltyComponents(load, {
      fallback:opts.fallback,
      fallback:opts?.fallback?<div>{opts?.fallback}</div>:<div/>,
      intersectionObserverOptions,
    });
  }
else {
  return createLazy(load,opts.fallback)
}
}

module.exports = lazyVisiblity;
