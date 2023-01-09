import React from "react";

import { cleanup, render, screen, waitFor } from "@testing-library/react";

import { act } from "react-dom/test-utils";

import {
    IntersectionObserver,
    makeElementsVisible,
    globallyTrackedElements,
} from "../../__mocks__/IntersectionObserver";

global.IntersectionObserver = IntersectionObserver;

const loadedComponent = jest.fn(() => <div data-testid="loaded-component" />);
// add a preload function to loadedComponent to load this component on demand
loadedComponent.preload = jest.fn(() => <div data-testid="loaded-component" />);


// add chunkName function to import function. It is used to generate keys for visibleElements map

const chunkName = jest.fn(() => "dummyComponentKey");
const loader = () => Promise.resolve(loadedComponent);
loader.chunkName = function () {
    return "dummyComponentKey";
};

const opts = {
    fallback: () => <div data-testid="fallback" />,
};

const props = { a: 1, b: 2 };

jest.doMock("@loadable/component", () => {
    return jest.fn(() => loadedComponent);
});

describe("the component loads for the first time", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
        globallyTrackedElements.length = 0;
    });
    test("exports loadableVisibilty as a function", () => {
        const loadableVisiblity = require("../../loadable-components");
        expect(typeof loadableVisiblity).toBe("function");
    });

    test("doesnt return loadable", () => {
        const loadable = require("@loadable/component");
        const loadableVisiblity = require("../../loadable-components");

        const Loader = loadableVisiblity(loader, opts);

        expect(loadable).toHaveBeenCalledWith(loader, opts);
        expect(Loader).not.toBe(loadable(loader, opts));
    });

    test(`calls "loadedComponent" when elements are visible`, async () => {
        const loadable = require("@loadable/component");
        const loadableVisiblity = require("../../loadable-components");
        const Loader = loadableVisiblity(loader);

        const { findByTestId, debug } = render(<Loader {...props} />);

        expect(loadedComponent).not.toHaveBeenCalled();

        act(() => makeElementsVisible("byRatio"));

        // The actual component is called only when it is visible in the viewport
        expect(loadedComponent).toHaveBeenCalledWith(props, expect.anything());
    });
    test('calls "loadedComponent" when intersectionRatio equals 0 but isIntersecting is true', async () => {
        const loadable = require("@loadable/component");
        const loadableVisiblity = require("../../loadable-components");
        const Loader = loadableVisiblity(loader);

        const { findByTestId, debug } = render(<Loader {...props} />);

        expect(loadedComponent).not.toHaveBeenCalled();

        act(() => makeElementsVisible("byIntersecting"));

        expect(loadedComponent).toHaveBeenCalledWith(props, expect.anything());
    });

    test(`preload calls "loadable" preload`, () => {
        const loadable = require("@loadable/component");
        const loadableVisiblity = require("../../loadable-components");
        const Loader = loadableVisiblity(loader);
        // call the preload function
        act(() => {
            Loader.preload();
        });
        // the loadable's preload function has been called
        expect(loadable().preload).toHaveBeenCalled();
    });

    test("preload will cause the loadable component to be displayed", async () => {
        const loadable = require("@loadable/component");
        const loadableVisiblity = require("../../loadable-components");
        const Loader = loadableVisiblity(loader);

        // Before preload has been called Loader will show a fallback
        const { findByTestId } = render(<Loader {...props} />);

        expect(await findByTestId("loader")).toBeTruthy();
        // call the preload function
        act(() => {
            Loader.preload();
        });
        // After preload has been called Loader will the loaded-component
        expect(await findByTestId("loaded-component")).toBeTruthy();
    });

    test("it displays the loadable component when it becomes visible", async () => {
        const loadable = require("@loadable/component");
        const loadableVisiblity = require("../../loadable-components");
        const Loader = loadableVisiblity(loader);

        const { findByTestId } = render(<Loader {...props} />);
        // Loader shows a fallback loader till the it becomes visible in the viewport
        expect(await findByTestId("loader")).toBeTruthy();
        // make the element visible in the viewport
        act(() => {
            makeElementsVisible();
        });
        // Loader shows the actual component when it becomes visible in the viewport
        expect(await findByTestId("loaded-component")).toBeTruthy();
    });

    test("it does not set up visibility handlers until mounted", () => {
        const loadable = require("@loadable/component");
        const loadableVisiblity = require("../../loadable-components");
        const Loader = loadableVisiblity(loader);

        // Intersection observer does not attach visibility handlers to components until mounted
        expect(globallyTrackedElements.length).toEqual(0);

        render(<Loader {...props} />);
        // Intersection observer will observe the component when it is mounted
        expect(globallyTrackedElements.length).toEqual(1);
    });
});