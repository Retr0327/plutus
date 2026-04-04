import { DEFAULT_THEME } from '@mantine/core';
import { greycliffCF } from './GreycliffCF';

function FontsStyle() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `:root{ --docs-font-primary: ${greycliffCF.style.fontFamily}, ${DEFAULT_THEME.fontFamily}; }`,
      }}
    />
  );
}

export default FontsStyle;
