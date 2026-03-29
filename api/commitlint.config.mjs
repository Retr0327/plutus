export default {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'reference-rule': (parsed) => {
          const pattern = /\s\(ref #\d+\)$/;
          if (!pattern.test(parsed.subject)) {
            return [
              false,
              'Commit message must be in format "type: description (ref #[issue number])"',
            ];
          }
          return [true];
        },
      },
    },
  ],
  rules: { 'reference-rule': [2, 'always'] },
};
