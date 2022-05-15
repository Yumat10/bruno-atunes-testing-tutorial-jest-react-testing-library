import React, { ReactNode } from 'react';
import { SWRConfig } from 'swr';
import { Fetcher, PublicConfiguration } from 'swr/dist/types';

export function MySwrConfig({
  children,
  swrConfig,
  disableCache,
}: {
  children?: ReactNode;
  // eslint-disable-next-line
  swrConfig?: Partial<PublicConfiguration<any, any, Fetcher<any>>>;
  disableCache?: boolean;
}) {
  return disableCache ? (
    <SWRConfig
      value={{
        fetcher: customFetcher,
        ...swrConfig,
        provider: () => new Map(),
      }}
    >
      {children}
    </SWRConfig>
  ) : (
    <SWRConfig value={{ fetcher: customFetcher, ...swrConfig }}>
      {children}
    </SWRConfig>
  );
}

export async function customFetcher(url: string) {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const json = (await res.json()) as { message: string };
    throw new Error(json.message);
  }

  return res.json();
}
