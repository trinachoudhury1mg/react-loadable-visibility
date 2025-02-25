import React, { Component } from "react";
import loadable from "@loadable/component";
import createLoadableVisibilityComponent from "./createLoadableVisibilityComponent";
import { IntersectionObserver } from "./capacities";
import createLoadableServerComponent from "./createLoadableServerComponent";

function loadableVisiblity(load, opts = {}, intersectionObserverOptions) {
    if (IntersectionObserver) {
        return createLoadableVisibilityComponent([load, opts], {
            Loadable: loadable,
            preloadFunc: "preload",
            loadFunc: "load",
            LoadingComponent: opts.fallback ? () => opts.fallback : null,
            intersectionObserverOptions,
        });
    } else {
        const newOpts = {
            ...opts,
            fallback: opts?.fallback ? <div>{opts?.fallback}</div> : <div />,
        };
        return createLoadableServerComponent(load, newOpts);
    }
}

module.exports = loadableVisiblity;
