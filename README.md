<div align="center">
<h1>React Redux Test Renderer</h1>

[![Build status](https://badge.buildkite.com/6e35b17cae34535762b1a77b9dd64d24b53e84ed1fd9005ef1.svg?branch=master)](https://buildkite.com/tedshaughnessy/react-redux-test-renderer)

Extends and works with an existing `@test-library/react` installation

Simplifies the test setup of components using wrappers like Redux, React-Context and more.

</div>
<br>

---
<br>

This is just the wrapper for the package that provides the integration tests.

If you're looking for the package it can be found in the package folder, the readme can be found [here](package/README.md)

Why do the integration test wrap the package? The package requires peerDependencies and the integration layer resolves them.

<br>

---