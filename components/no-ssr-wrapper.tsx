import React, { PropsWithChildren } from 'react';

import dynamic from 'next/dynamic';

const NoSSRWrapper = (props: PropsWithChildren) => (
  <React.Fragment>{props.children}</React.Fragment>
);

export default dynamic(() => Promise.resolve(NoSSRWrapper), {
  ssr: false,
});
