const React = require("react");

const { cleanup, render, screen, waitFor } = require("@testing-library/react");

import { act } from "react-dom/test-utils";

const {
    IntersectionObserver,
    makeElementsVisible,
    globallyTrackedElements,
} = require("../../__mocks__/IntersectionObserver");

global.IntersectionObserver = IntersectionObserver;

const loadedComponent = jest.fn(() => <div data-testid="loaded-component" />);
loadedComponent.preload = jest.fn(() => <div data-testid="loaded-component" />);
const chunkName = jest.fn(() => "dummyComponentKey");

const loader = () => Promise.resolve(loadedComponent);
loader.chunkName = function () {
    return "dummyComponentKey";
};

const opts = {
    fallback: () => <div data-testid="fallback" />,
};

const args = [loader, opts];

const props = { a: 1, b: 2 };

beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    globallyTrackedElements.length = 0;
    cleanup();
});
afterEach(() => {});

describe("Loadable", () => {
    test("exports loadableVisibilty as a function", () => {
        const loadableVisiblity = require("../../loadable-components");
        expect(typeof loadableVisiblity).toBe("function");
    });

    test("doesnt return loadable", () => {
        // Mock @loadable/component to get a stable `preload` function
        jest.doMock("@loadable/component", () => {
            return jest.fn(() => loadedComponent);
        });
        const loadable = require("@loadable/component");
        const loadableVisiblity = require("../../loadable-components"); // Require our tested module with the above mock applied

        const Loader = loadableVisiblity(loader, opts);

        expect(loadable).toHaveBeenCalledWith(loader, opts);
        expect(Loader).not.toBe(loadable(loader, opts));
    });

    test('calls "loadable" when elements are visible', async () => {
        jest.doMock("@loadable/component", () => {
            return jest.fn(() => loadedComponent);
        });
        const loadable = require("@loadable/component");
        const loadableVisiblity = require("../../loadable-components");
        const Loader = loadableVisiblity(loader);

        const { findByTestId, debug } = render(<Loader {...props} />);

        expect(loadedComponent).not.toHaveBeenCalled();

        act(() => makeElementsVisible("byRatio"));

        expect(loadedComponent).toHaveBeenCalledWith(props, expect.anything());
    });
    test('calls "loadable" when intersectionRatio equals 0 but isIntersecting is true', async () => {
        jest.doMock("@loadable/component", () => {
            return jest.fn(() => loadedComponent);
        });
        const loadable = require("@loadable/component");
        const loadableVisiblity = require("../../loadable-components");
        const Loader = loadableVisiblity(loader);

        const { findByTestId, debug } = render(<Loader {...props} />);

        expect(loadedComponent).not.toHaveBeenCalled();

        act(() => makeElementsVisible("byIntersecting"));

        expect(loadedComponent).toHaveBeenCalledWith(props, expect.anything());
    });

    test("preload calls loadable load", () => {
        // Mock @loadable/component to get a stable `preload` function
        jest.doMock("@loadable/component", () => {
            return jest.fn(() => loadedComponent);
        });
        const loadable = require("@loadable/component");
        const loadableVisiblity = require("../../loadable-components");
        const Loader = loadableVisiblity(loader);

        act(() => {
            Loader.preload();
        });
        expect(loadable().preload).toHaveBeenCalled();
    });

    test("preload will cause the loadable component to be displayed", async () => {
        jest.doMock("@loadable/component", () => {
            return jest.fn(() => loadedComponent);
        });
        const loadable = require("@loadable/component");
        const loadableVisiblity = require("../../loadable-components");
        const Loader = loadableVisiblity(loader);

        const { findByTestId } = render(<Loader {...props} />);

        expect(await findByTestId("loader")).toBeTruthy();

        act(() => {
            Loader.preload();
        });

        expect(await findByTestId("loaded-component")).toBeTruthy();
    });
});

test("it displays the loadable component when it becomes visible", async () => {
    jest.doMock("@loadable/component", () => {
        return jest.fn(() => loadedComponent);
    });
    const loadable = require("@loadable/component");
    const loadableVisiblity = require("../../loadable-components");
    const Loader = loadableVisiblity(loader);

    const { findByTestId } = render(<Loader {...props} />);
    expect(await findByTestId("loader")).toBeTruthy();
    act(() => {
        makeElementsVisible();
    });

    expect(await findByTestId("loaded-component")).toBeTruthy();
});

test("it does not set up visibility handlers until mounted", () => {
    jest.doMock("@loadable/component", () => {
        return jest.fn(() => loadedComponent);
    });
    const loadable = require("@loadable/component");
    const loadableVisiblity = require("../../loadable-components");
    const Loader = loadableVisiblity(loader);

    expect(globallyTrackedElements.length).toEqual(0);

    render(<Loader {...props} />);
    expect(globallyTrackedElements.length).toEqual(1);
});
