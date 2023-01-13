const RESET_MODULE_EXCEPTIONS = ["react", "react-dom"];

let mockActualRegistry = {};

RESET_MODULE_EXCEPTIONS.forEach((moduleName) => {
    jest.doMock(moduleName, () => {
        if (!mockActualRegistry[moduleName]) {
            mockActualRegistry[moduleName] = jest.requireActual(moduleName);
        }
        return mockActualRegistry[moduleName];
    });
});
