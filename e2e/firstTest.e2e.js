describe('App Launch Test', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should show login screen title', async () => {
    await expect(element(by.text('Welcome Back'))).toBeVisible();
  });
});
