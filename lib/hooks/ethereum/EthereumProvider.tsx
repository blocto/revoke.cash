import { BloctoConnector } from '@blocto/wagmi-connector';
import { getViemChainConfig, SUPPORTED_CHAINS } from 'lib/utils/chains';
import { SECOND } from 'lib/utils/time';
import { ReactNode, useEffect } from 'react';
import { configureChains, createConfig, useAccount, useConnect, WagmiConfig } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { publicProvider } from 'wagmi/providers/public';

interface Props {
  children: ReactNode;
}

const { chains: wagmiChains, publicClient } = configureChains(
  SUPPORTED_CHAINS.map(getViemChainConfig),
  [publicProvider()],
  // TODO: Fix cacheTime independent of pollingInterval
  { batch: { multicall: true }, pollingInterval: 4 * SECOND },
);

// We don't want to auto-disconnect the user when they switch to certain networks
// https://github.com/MetaMask/metamask-extension/issues/13375#issuecomment-1027663334
class InjectedConnectorNoDisconnectListener extends InjectedConnector {
  protected onDisconnect = async () => {};
}

export const connectors = [
  new InjectedConnectorNoDisconnectListener({ chains: wagmiChains, options: { name: 'Browser Wallet' } }),
  new BloctoConnector({ chains: wagmiChains }),
];

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export const EthereumProvider = ({ children }: Props) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <EthereumProviderChild>{children}</EthereumProviderChild>
    </WagmiConfig>
  );
};

const EthereumProviderChild = ({ children }: Props) => {
  const { connect, connectors } = useConnect();
  const { connector } = useAccount();

  // If the Safe connector is available, connect to it even if other connectors are available
  // (if another connector auto-connects (or user disconnects), we still override it with the Safe connector)
  useEffect(() => {
    const safeConnector = connectors?.find((connector) => connector.id === 'safe' && connector.ready);
    if (!safeConnector || connector === safeConnector) return;
    connect({ connector: safeConnector });
  }, [connectors, connector]);

  return <>{children}</>;
};
