declare module '@ioc:Adonis/Core/HttpContext' {
  interface HttpContextContract {
    language: String;
    country: String;
  }
}
