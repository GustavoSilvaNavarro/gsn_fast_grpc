## Changes

- List your changes

## Checklist before requesting a review

### For all pull requests:

- [ ] I have added unit and/or integration tests
- [ ] I have performed a self-review of my code
- [ ] I have added a guide for how to test my changes in DEV for my PR reviewer in `How to test`, if it is possible

### If documentation changes are included:

- [ ] I have added OpenAPI specs for all new endpoints and schemas (`src/docs/**/*.yml`)
- [ ] I have updated OpenAPI specs for any updated endpoints and schemas (`src/docs/**/*.yml`)
- [ ] I have included novel error responses in OpenAPI specs for new and updated endpoints

## How to test

### Locally

- Unit Testing: `make unit`
- Integration Testing: `make integration`
