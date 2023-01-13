import React, { useEffect, useState, useRef } from "react";
import { IntersectionObserver } from "./capacities";
import loadable from "@loadable/component";

function createLoadableServerComponent(load, opts) {
    function LoadableServerComponent(props) {
        let Loadable = loadable(load, opts);

        if (props.fallback && !opts?.ssr) {
            return <Loadable {...props} fallback={<div>{props.fallback}</div>} />;
        } else return <Loadable {...props} />;
    }
    return LoadableServerComponent;
}

export default createLoadableServerComponent;
