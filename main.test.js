const { ethers } = require("ethers");

const guildAuth = require("./main");

describe("Generate new mnemonic if mnemonic is not exist", () => {
  expect(new guildAuth().getMnemonic()).toBeDefined();
});

describe("Check instantiate input is equal to the instantiate value", () => {
  const mnemonic = new guildAuth().getMnemonic();
  expect(new guildAuth(mnemonic).getMnemonic()).toMatch(mnemonic);
});

describe("Check nonce generation", () => {
  const auth = new guildAuth();

  const { random, nonce } = auth.generateNonce();

  test("Check nonce size", () => {
    expect(nonce.length).toBe(66);
  });

  test("Check generate nonce is linked to address", () => {
    expect(
      ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(`${auth.getAddress().toLowerCase()}${random}`)
      )
    ).toMatch(nonce);
  });
});

/*
describe("Check prepareRequest", () => {
  const auth = new guildAuth();

  describe("Test without payload", () => {
    auth.prepareRequest().then((requestWithoutPayloadString) => {
      test("Check request without payload return valid json", () => {
        expect(parserTest(requestWithoutPayloadString)).toBe(0);
      });

      const requestWithoutPayload = JSON.parse(requestWithoutPayloadString);
      test("Check request object is not null", () => {
        expect(Object.entries(requestWithoutPayload).length).not.toBe(0);
      });
      it("asd")
      auth
        .signMessage(
          requestWithoutPayload.validation.nonce,
          requestWithoutPayload.validation.random,
          requestWithoutPayload.validation.hash,
          requestWithoutPayload.validation.timestamp
        )
        .then((signedMessage) => {
          test("Check signMessage", () => {
            expect(signedMessage).toMatch(
              requestWithoutPayload.validation.addressSignedMessage
            );
          });
        });
    });
  });
});


describe("Test with payload", () => {
  const requestWithPayloadString = auth.prepareRequest({
    test: 1234,
  });
  test("Check request with payload return valid json", () => {
    expect(parserTest(requestWithPayloadString)).toBe(0);
  });
  const requestWithPayload = JSON.parse(requestWithPayloadString);
  test("Check request object is not null", () => {
    expect(Object.entries(requestWithPayload).length).not.toBe(0);
  });
  });

const parserTest = (payload) => {
  try {
    JSON.parse(payload);
    return 0;
  } catch (error) {
    return 1;
  }
};
*/
