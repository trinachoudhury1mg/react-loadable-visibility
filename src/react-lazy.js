import React, { Component } from "react";
import {lazy} from "React";
import createLazyVisibiltyComponents from "./createLazyVisibiltyComponents";
import { IntersectionObserver } from "./capacities";

function lazyVisiblity(load, opts = {}, intersectionObserverOptions) {
    return createLazyVisibiltyComponents([load, opts], {
      Lazy: lazy,
      LoadingComponent: opts.fallback ? () => opts.fallback : null,
      intersectionObserverOptions,
    });
  }

module.exports = lazyVisiblity;
