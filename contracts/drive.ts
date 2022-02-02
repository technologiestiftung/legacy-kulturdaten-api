declare module '@ioc:Adonis/Core/Drive' {
  interface DisksList {
    s3: {
      config: S3DriverConfig;
      implementation: S3DriverContract;
    };
  }
}
