const loadedComponent = jest.fn(() => <div data-testid="loaded-component" />);
loadedComponent.preload = jest.fn(() => loadedComponent);

const loader = () => Promise.resolve(loadedComponent);
loader.chunkName = function () {
    return "dummyComponentKey";
};

jest.doMock("@loadable/component", () => {
    return jest.fn(() => loadedComponent);
});

const opts = {
    fallback: () => <div data-testid="fallback" />,
};

describe("the component runs on the server", () => {
    test("exports loadableVisibilty as a function", () => {
        const loadableServerComponent = require("../../loadable-components");
        expect(typeof loadableServerComponent).toBe("function");
    });

    test("doesnt return loadable", () => {
        const loadable = require("@loadable/component");
        const loadableServerComponent = require("../../loadable-components");

        const Loader = loadableServerComponent(loader, opts);

        expect(Loader).not.toBe(loadable(loader, opts));
    });
});
