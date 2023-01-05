let mockActualReact

jest.doMock("react", () => {
  if (!mockActualReact) {
    mockActualReact = jest.requireActual("react")
  }
  return mockActualReact
})
