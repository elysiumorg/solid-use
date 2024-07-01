import { parse } from 'comment-parser';

const formatCodeWithLineBreaks = (code: string) => {
  return code.replace(/;\s*/g, ';\n').replace(/\s*=\s*/g, ' = ');
};

export const parseHookJsdoc = (file: string) => {
  const jsdoc = parse(file)[0];
  const description = jsdoc.tags.find(({ tag }) => tag === 'description');
  const usage = jsdoc.tags.find(({ tag }) => tag === 'example');
  const deprecated = jsdoc.tags.find(({ tag }) => tag === 'deprecated');
  const category = jsdoc.tags.find(({ tag }) => tag === 'category');
  const apiParameters = jsdoc.tags.filter(
    ({ tag }) => tag === 'param' || tag === 'overload' || tag === 'returns',
  );

  if (usage) {
    usage.description = formatCodeWithLineBreaks(usage.description);
  }

  return { description, usage, apiParameters, deprecated, category };
};
