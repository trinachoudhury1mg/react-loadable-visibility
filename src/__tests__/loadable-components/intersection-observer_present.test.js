import React from "react";

import { cleanup, render, screen, waitFor } from "@testing-library/react";

import { act } from "react-dom/test-utils";

import {
    IntersectionObserver,
    makeElementsVisible,
    globallyTrackedElements,
    globallyVisibleElements,
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
const expectedProps = { a: 1, b: 2, dataTestId: "loader" };

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

        const { findByTestId, debug } = render(<Loader {...props} dataTestId="loader" />);

        expect(loadedComponent).not.toHaveBeenCalled();

        act(() => makeElementsVisible("byRatio"));

        // The actual component is called only when it is visible in the viewport
        expect(loadedComponent).toHaveBeenCalledWith(expectedProps, expect.anything());
    });
    test('calls "loadedComponent" when intersectionRatio equals 0 but isIntersecting is true', async () => {
        const loadable = require("@loadable/component");
        const loadableVisiblity = require("../../loadable-components");
        const Loader = loadableVisiblity(loader);

        const { findByTestId, debug } = render(<Loader {...props} dataTestId="loader" />);

        expect(loadedComponent).not.toHaveBeenCalled();

        act(() => makeElementsVisible("byIntersecting"));

        expect(loadedComponent).toHaveBeenCalledWith(expectedProps, expect.anything());
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
        const { findByTestId } = render(<Loader {...props} dataTestId="loader" />);

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

        const { findByTestId, debug } = render(<Loader {...props} dataTestId="loader" />);
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

        render(<Loader {...props} dataTestId="loader" />);
        // Intersection observer will observe the component when it is mounted
        expect(globallyTrackedElements.length).toEqual(1);
    });
    test("displays the loadable component when ssr option is set to true", async () => {
        const loadable = require("@loadable/component");
        const loadableVisiblity = require("../../loadable-components");
        const Loader = loadableVisiblity(loader, { ssr: true });

        const { findByTestId } = render(<Loader {...props} dataTestId="loader" />);

        expect(await findByTestId("loaded-component")).toBeTruthy();
    });
});

describe("the component loads for the second time", () => {
    beforeEach(() => {
        //  render, unmount and make the component visible before each test
        const loadable = require("@loadable/component");
        const loadableVisiblity = require("../../loadable-components");
        const Loader = loadableVisiblity(loader);
        const { unmount } = render(<Loader {...props} dataTestId="loader" />);
        act(() => {
            makeElementsVisible();
        });
        unmount();
    });
    afterAll(() => {
        jest.clearAllMocks();
        jest.resetModules();
        globallyTrackedElements.length = 0;
    });

    test("it display the loaded-component and not the fallback after the component has been rendered and unmounted", async () => {
        const loadable = require("@loadable/component");
        const loadableVisiblity = require("../../loadable-components");
        const Loader = loadableVisiblity(loader);

        const { findByTestId, debug } = render(<Loader {...props} dataTestId="loader" />);
        expect(await findByTestId("loaded-component")).toBeTruthy();
    });

    test("intersection observer does not track the component once it has been rendered and unmmounted", async () => {
        const loadable = require("@loadable/component");
        const loadableVisiblity = require("../../loadable-components");
        const Loader = loadableVisiblity(loader);

        const { findByTestId, debug } = render(<Loader {...props} dataTestId="loader" />);
        expect(globallyTrackedElements.length).toEqual(0);
        expect(globallyVisibleElements.length).not.toEqual(0);
    });
});

describe("test hydration mismatches: ", () => {
    beforeAll(() => {
        jest.dontMock("@loadable/component");
    });
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
        globallyTrackedElements.length = 0;
        cleanup();
    });
    test("match snapshot on server when fallback has been passed via opts", async () => {
        global.window.IntersectionObserver = null;
        const loadable = require("@loadable/component");
        const loadableVisiblity = require("../../loadable-components");
        const Loader = loadableVisiblity(loader, { ssr: false });
        const { container, unmount } = render(<Loader {...props} fallback={<div>fallback</div>} />);
        expect(container).toMatchSnapshot();
    });

    test("match snapshot on client when fallback has been passed via opts", async () => {
        global.window.IntersectionObserver = IntersectionObserver;
        const loadable = require("@loadable/component");
        const loadableVisiblity = require("../../loadable-components");
        const Loader = loadableVisiblity(loader, { ssr: false, fallback: <div>fallback</div> });
        const { container, unmount } = render(<Loader {...props} />);
        expect(container).toMatchSnapshot();
    });

    test("match snapshot on server when no fallback has been passed", async () => {
        global.window.IntersectionObserver = null;
        const loadable = require("@loadable/component");
        const loadableVisiblity = require("../../loadable-components");
        const Loader = loadableVisiblity(loader, { ssr: false });
        const { container, unmount } = render(<Loader {...props} />);
        expect(container).toMatchSnapshot();
    });

    test("match snapshot on client when no fallback has been passed", async () => {
        global.window.IntersectionObserver = IntersectionObserver;
        const loadable = require("@loadable/component");
        const loadableVisiblity = require("../../loadable-components");
        const Loader = loadableVisiblity(loader, { ssr: false });
        const { container, unmount } = render(<Loader {...props} />);
        expect(container).toMatchSnapshot();
    });
    test("match snapshot on server when fallback has been passed via props", async () => {
        global.window.IntersectionObserver = null;
        const loadable = require("@loadable/component");
        const loadableVisiblity = require("../../loadable-components");
        const Loader = loadableVisiblity(loader, { ssr: false });
        const { container, unmount } = render(<Loader {...props} fallback={<div>fallback</div>} />);
        expect(container).toMatchSnapshot();
    });
});

test("match snapshot on client when fallback has been passed via props", async () => {
    global.window.IntersectionObserver = IntersectionObserver;
    const loadable = require("@loadable/component");
    const loadableVisiblity = require("../../loadable-components");
    const Loader = loadableVisiblity(loader, { ssr: false });
    const { container, unmount } = render(<Loader {...props} fallback={<div>fallback</div>} />);
    expect(container).toMatchSnapshot();
});