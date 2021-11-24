import { string } from '@ioc:Adonis/Core/Helpers';
import { validator } from '@ioc:Adonis/Core/Validator';
import markdownToTxt from 'markdown-to-txt';

const DESCRIPTION_MAX_LENGTH = 1500;

validator.rule('description', (value, _, options) => {
  if (typeof value !== 'string') {
    return;
  }

  const plainText = markdownToTxt(value);
  if (plainText.length > DESCRIPTION_MAX_LENGTH) {
    options.errorReporter.report(
      options.pointer,
      'maxLength',
      'maxLength validation failed',
      options.arrayExpressionPointer
    );
  }
});
