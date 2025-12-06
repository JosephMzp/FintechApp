export const firebaseMock = {
  uploadImage: jest.fn(() => Promise.resolve("https://fakeurl.com/image.jpg")),
};
